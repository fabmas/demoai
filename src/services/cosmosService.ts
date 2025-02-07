import { CosmosClient } from '@azure/cosmos';

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

  constructor() {
    const endpoint = import.meta.env.VITE_COSMOS_ENDPOINT;
    const key = import.meta.env.VITE_COSMOS_KEY;

    if (!endpoint || !key) {
      throw new Error('CosmosDB configuration is missing');
    }

    this.client = new CosmosClient({ 
      endpoint, 
      key,
      connectionPolicy: {
        requestTimeout: 30000,
        retryOptions: {
          maxRetries: 3,
          maxRetryAttemptCount: 3,
          fixedRetryIntervalInMilliseconds: 1000,
          maxWaitTimeInSeconds: 60
        }
      }
    });
  }

  private async ensureInitialized() {
    if (!this.initPromise) {
      this.initPromise = this.initialize();
    }
    return this.initPromise;
  }

  async initialize() {
    try {
      const { database } = await this.client.databases.createIfNotExists({
        id: this.database
      });

      await Promise.all([
        database.containers.createIfNotExists({
          id: this.transcriptionsContainer,
          partitionKey: { paths: ['/id'] }
        }),
        database.containers.createIfNotExists({
          id: this.templatesContainer,
          partitionKey: { paths: ['/id'] }
        })
      ]);

      // Initialize with sample templates if none exist
      const templatesContainer = database.container(this.templatesContainer);
      const { resources: templates } = await templatesContainer.items.readAll().fetchAll();

      if (templates.length === 0) {
        const sampleTemplates: Omit<Template, 'id'>[] = [
          {
            name: 'Verbale esteso',
            prompt: 'Prestare particolare attenzione agli eventi, nomi, date, ruoli e leggi citate.\nPer il testo inserito generare un verbale seguendo le linee guida riportate sotto\n### Sezione Intestazione:\n- Data e titolo dell\'audizione\n- Scopo dell\'audizione\n### Introduzione:\n- Contesto generale\n- Partecipanti principali\n### Contenuto principale:\n- Punti chiave discussi\n- Dichiarazioni significative\n- Riferimenti a eventi o documenti\n### Conclusioni:\n- Sintesi delle decisioni prese\n- Prossimi passi concordati'
          },
          {
            name: 'Verbale riassuntivo',
            prompt: 'Genera un riassunto conciso ma completo della trascrizione, evidenziando:\n- Punti principali discussi\n- Decisioni prese\n- Azioni concordate\n- Tempistiche stabilite'
          },
          {
            name: 'Riassunto anonimizzato',
            prompt: 'Genera una versione anonimizzata del contenuto, sostituendo tutti i nomi propri, luoghi specifici e altri identificatori personali con placeholder generici (es. [Persona1], [Luogo1], etc). Mantieni il significato e il contesto del discorso preservando la privacy delle persone coinvolte.'
          }
        ];

        for (const template of sampleTemplates) {
          await this.createTemplate({
            ...template,
            id: crypto.randomUUID()
          });
        }
      }
    } catch (error) {
      console.error('Error initializing CosmosDB:', error);
      throw error;
    }
  }

  async getTranscriptions(): Promise<Transcription[]> {
    try {
      await this.ensureInitialized();
      const container = this.client.database(this.database).container(this.transcriptionsContainer);
      const { resources } = await container.items.readAll().fetchAll();
      return resources;
    } catch (error) {
      console.error('Error fetching transcriptions:', error);
      return [];
    }
  }

  async getTranscription(id: string): Promise<Transcription | null> {
    try {
      await this.ensureInitialized();
      const container = this.client.database(this.database).container(this.transcriptionsContainer);
      const { resource } = await container.item(id, id).read();
      return resource || null;
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
      
      if (!existingTranscription) {
        throw new Error(`Transcription with id ${id} not found`);
      }

      const updatedTranscription = {
        ...existingTranscription,
        ...transcription,
        id
      };

      const { resource } = await container.item(id, id).replace(updatedTranscription);
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
      return resources;
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
      return resource;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }
}