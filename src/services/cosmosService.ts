import { CosmosClient, CosmosClientOptions, Database } from '@azure/cosmos';

export interface Prompt {
  name: string;
  prompt: string;
  blobPrompt: string;
}

export interface Speaker {
  name: string;
}

export interface Transcription {
  id: string;
  name: string;
  date: string;
  status: 'processing' | 'completed' | 'failed';
  reviewStatus: 'draft' | 'reviewed';
  language?: string;
  confidence?: number;
  blobAudio?: string;
  blobJson?: string;
  blobTxt?: string;
  prompts?: Prompt[];
  speakers?: Speaker[];
}

export interface Template {
  id: string;
  name: string;
  prompt: string;
}

export class CosmosService {
  private client: CosmosClient;
  private database: string = 'transcriptions-db';
  private transcriptionsContainer: string = 'Transcriptions';
  private templatesContainer: string = 'Templates';
  private initPromise: Promise<void> | null = null;
  private dbInstance: Database | null = null;

  constructor() {
    const endpoint = import.meta.env.VITE_COSMOS_ENDPOINT;
    const key = import.meta.env.VITE_COSMOS_KEY;

    if (!endpoint || !key) {
      throw new Error('CosmosDB configuration is missing');
    }

    const options: CosmosClientOptions = {
      endpoint,
      key,
      connectionPolicy: {
        requestTimeout: 30000,
        retryOptions: {
          maxRetryAttemptCount: 3,
          fixedRetryIntervalInMilliseconds: 1000,
          maxWaitTimeInSeconds: 60
        }
      }
    };

    this.client = new CosmosClient(options);
  }

  private async ensureInitialized() {
    if (!this.initPromise) {
      this.initPromise = this.initialize();
    }
    return this.initPromise;
  }

  async initialize() {
    try {
      // Create database if it doesn't exist
      const { database } = await this.client.databases.createIfNotExists({
        id: this.database,
        throughput: 400 // Minimum throughput
      });
      
      this.dbInstance = database;

      // Create containers if they don't exist
      const containerPromises = [
        database.containers.createIfNotExists({
          id: this.transcriptionsContainer,
          partitionKey: { paths: ['/id'] },
          defaultTtl: -1 // Never expire
        }),
        database.containers.createIfNotExists({
          id: this.templatesContainer,
          partitionKey: { paths: ['/id'] },
          defaultTtl: -1 // Never expire
        })
      ];

      await Promise.all(containerPromises);

      // Initialize templates container with sample data if empty
      const templatesContainer = database.container(this.templatesContainer);
      const { resources: templates } = await templatesContainer.items.readAll().fetchAll();

      if (templates.length === 0) {
        const sampleTemplates: Template[] = [
          {
            id: crypto.randomUUID(),
            name: 'Verbale esteso',
            prompt: 'Prestare particolare attenzione agli eventi, nomi, date, ruoli e leggi citate.\nPer il testo inserito generare un verbale seguendo le linee guida riportate sotto\n### Sezione Intestazione:\n- Data e titolo dell\'audizione\n- Scopo dell\'audizione\n### Introduzione:\n- Contesto generale\n- Partecipanti principali\n### Contenuto principale:\n- Punti chiave discussi\n- Dichiarazioni significative\n- Riferimenti a eventi o documenti\n### Conclusioni:\n- Sintesi delle decisioni prese\n- Prossimi passi concordati'
          },
          {
            id: crypto.randomUUID(),
            name: 'Verbale riassuntivo',
            prompt: 'Genera un riassunto conciso ma completo della trascrizione, evidenziando:\n- Punti principali discussi\n- Decisioni prese\n- Azioni concordate\n- Tempistiche stabilite'
          },
          {
            id: crypto.randomUUID(),
            name: 'Riassunto anonimizzato',
            prompt: 'Genera una versione anonimizzata del contenuto, sostituendo tutti i nomi propri, luoghi specifici e altri identificatori personali con placeholder generici (es. [Persona1], [Luogo1], etc). Mantieni il significato e il contesto del discorso preservando la privacy delle persone coinvolte.'
          }
        ];

        for (const template of sampleTemplates) {
          await this.createTemplate(template);
        }
      }
    } catch (error) {
      console.error('Error initializing CosmosDB:', error);
      throw error;
    }
  }

  private isValidTranscription(item: any): item is Transcription {
    return (
      typeof item === 'object' &&
      item !== null &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.date === 'string' &&
      ['processing', 'completed', 'failed'].includes(item.status) &&
      ['draft', 'reviewed'].includes(item.reviewStatus)
    );
  }

  async getTranscriptions(): Promise<Transcription[]> {
    try {
      await this.ensureInitialized();
      const container = this.client.database(this.database).container(this.transcriptionsContainer);
      const { resources } = await container.items.readAll().fetchAll();

      // Filter and map the resources to ensure they match the Transcription type
      const validTranscriptions = resources
        .filter(this.isValidTranscription)
        .map(item => ({
          id: item.id,
          name: item.name,
          date: item.date,
          status: item.status,
          reviewStatus: item.reviewStatus,
          language: item.language,
          confidence: item.confidence,
          blobAudio: item.blobAudio,
          blobJson: item.blobJson,
          blobTxt: item.blobTxt,
          prompts: item.prompts,
          speakers: item.speakers
        }));

      return validTranscriptions;
    } catch (error) {
      console.error('Error loading transcriptions:', error);
      return [];
    }
  }

  async getTranscription(id: string): Promise<Transcription | null> {
    try {
      await this.ensureInitialized();
      const container = this.client.database(this.database).container(this.transcriptionsContainer);
      const { resource } = await container.item(id, id).read();
      
      if (!resource || !this.isValidTranscription(resource)) {
        return null;
      }
      
      return resource;
    } catch (error) {
      if ((error as any).code === 404) {
        return null;
      }
      console.error('Error fetching transcription:', error);
      throw error;
    }
  }

  async createTranscription(transcription: Transcription): Promise<Transcription> {
    try {
      await this.ensureInitialized();
      const container = this.client.database(this.database).container(this.transcriptionsContainer);
      const { resource } = await container.items.create(transcription);
      
      if (!resource || !this.isValidTranscription(resource)) {
        throw new Error('Failed to create transcription or received invalid data');
      }
      
      return resource;
    } catch (error) {
      console.error('Error creating transcription:', error);
      throw error;
    }
  }

  async updateTranscription(id: string, transcription: Partial<Transcription>): Promise<Transcription> {
    try {
      await this.ensureInitialized();
      const container = this.client.database(this.database).container(this.transcriptionsContainer);
      const { resource: existingTranscription } = await container.item(id, id).read();
      
      if (!existingTranscription || !this.isValidTranscription(existingTranscription)) {
        throw new Error(`Transcription with id ${id} not found or invalid`);
      }

      const updatedTranscription = {
        ...existingTranscription,
        ...transcription,
        id
      };

      const { resource } = await container.item(id, id).replace(updatedTranscription);
      
      if (!resource || !this.isValidTranscription(resource)) {
        throw new Error('Failed to update transcription or received invalid data');
      }
      
      return resource;
    } catch (error) {
      console.error('Error updating transcription:', error);
      throw error;
    }
  }

  async deleteTranscription(id: string): Promise<void> {
    try {
      await this.ensureInitialized();
      const container = this.client.database(this.database).container(this.transcriptionsContainer);
      await container.item(id, id).delete();
    } catch (error) {
      if ((error as any).code !== 404) {
        console.error('Error deleting transcription:', error);
        throw error;
      }
    }
  }

  async getTemplates(): Promise<Template[]> {
    try {
      await this.ensureInitialized();
      const container = this.client.database(this.database).container(this.templatesContainer);
      const { resources } = await container.items.readAll().fetchAll();
      
      return resources
        .filter((resource): resource is Required<Template> => 
          typeof resource.id === 'string' && 
          typeof resource.name === 'string' && 
          typeof resource.prompt === 'string'
        )
        .map(resource => ({
          id: resource.id,
          name: resource.name,
          prompt: resource.prompt
        }));
    } catch (error) {
      console.error('Error fetching templates:', error);
      return [];
    }
  }

  async createTemplate(template: Template): Promise<Template> {
    try {
      await this.ensureInitialized();
      const container = this.client.database(this.database).container(this.templatesContainer);
      const { resource } = await container.items.create(template);
      
      if (!resource || !resource.id || !resource.name || !resource.prompt) {
        throw new Error('Failed to create template or received invalid data');
      }
      
      return {
        id: resource.id,
        name: resource.name,
        prompt: resource.prompt
      };
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }
}