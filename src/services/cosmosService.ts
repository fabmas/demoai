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
        requestTimeout: 30000, // 30 seconds
        retryOptions: {
          maxRetries: 3
        }
      }
    });
  }

  async initialize() {
    if (!this.initPromise) {
      this.initPromise = this._initialize();
    }
    return this.initPromise;
  }

  private async _initialize() {
    try {
      // Create database if it doesn't exist
      const { database } = await this.client.databases.createIfNotExists({
        id: this.database
      });

      // Create containers if they don't exist
      await Promise.all([
        database.containers.createIfNotExists({
          id: this.transcriptionsContainer,
          partitionKey: '/id'
        }),
        database.containers.createIfNotExists({
          id: this.templatesContainer,
          partitionKey: '/id'
        })
      ]);

      // Initialize with sample data if containers are empty
      const transcriptionsContainer = database.container(this.transcriptionsContainer);
      const { resources: transcriptions } = await transcriptionsContainer.items.readAll().fetchAll();

      if (transcriptions.length === 0) {
        const sampleTranscriptions: Omit<Transcription, 'id'>[] = [
          {
            name: 'Meeting Recording 1',
            date: '2024-02-20',
            status: 'completed',
            reviewStatus: 'reviewed',
            language: 'en',
            confidence: 0.95,
            speakers: [
              { name: 'John Doe' },
              { name: 'Jane Smith' }
            ]
          },
          {
            name: 'Interview Session',
            date: '2024-02-21',
            status: 'processing',
            reviewStatus: 'draft'
          }
        ];

        await Promise.all(
          sampleTranscriptions.map(transcription => this.createTranscription(transcription))
        );
      }

      const templatesContainer = database.container(this.templatesContainer);
      const { resources: templates } = await templatesContainer.items.readAll().fetchAll();

      if (templates.length === 0) {
        const sampleTemplates: Omit<Template, 'id'>[] = [
          {
            name: 'Full Transcript',
            prompt: 'Generate a complete transcript of the conversation'
          },
          {
            name: 'Summary',
            prompt: 'Generate a concise summary of the main points discussed'
          }
        ];

        await Promise.all(
          sampleTemplates.map(template => this.createTemplate(template))
        );
      }
    } catch (error) {
      console.error('Error initializing CosmosDB:', error);
      throw new Error('Failed to initialize CosmosDB: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  private async getContainer(containerName: string) {
    await this.initialize();
    return this.client.database(this.database).container(containerName);
  }

  async getTranscriptions(): Promise<Transcription[]> {
    try {
      const container = await this.getContainer(this.transcriptionsContainer);
      const { resources } = await container.items.readAll().fetchAll();
      return resources;
    } catch (error) {
      console.error('Error fetching transcriptions:', error);
      throw new Error('Failed to fetch transcriptions: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async getTranscription(id: string): Promise<Transcription | null> {
    try {
      const container = await this.getContainer(this.transcriptionsContainer);
      const { resource } = await container.item(id, id).read();
      return resource || null;
    } catch (error) {
      if ((error as any).code === 404) {
        return null;
      }
      console.error('Error fetching transcription:', error);
      throw new Error('Failed to fetch transcription: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async createTranscription(transcription: Transcription): Promise<Transcription> {
    try {
      const container = await this.getContainer(this.transcriptionsContainer);
      const { resource } = await container.items.create(transcription);
      return resource;
    } catch (error) {
      console.error('Error creating transcription:', error);
      throw new Error('Failed to create transcription: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async updateTranscription(id: string, transcription: Partial<Transcription>): Promise<Transcription> {
    try {
      const container = await this.getContainer(this.transcriptionsContainer);
      const { resource: existingTranscription } = await container.item(id, id).read();
      
      if (!existingTranscription) {
        throw new Error(`Transcription with id ${id} not found`);
      }

      const updatedTranscription = {
        ...existingTranscription,
        ...transcription,
        id // Ensure ID remains unchanged
      };

      const { resource } = await container.item(id, id).replace(updatedTranscription);
      return resource;
    } catch (error) {
      console.error('Error updating transcription:', error);
      throw new Error('Failed to update transcription: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async deleteTranscription(id: string): Promise<void> {
    try {
      const container = await this.getContainer(this.transcriptionsContainer);
      await container.item(id, id).delete();
    } catch (error) {
      if ((error as any).code !== 404) { // Ignore 404 errors when deleting
        console.error('Error deleting transcription:', error);
        throw new Error('Failed to delete transcription: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  }

  async getTemplates(): Promise<Template[]> {
    try {
      const container = await this.getContainer(this.templatesContainer);
      const { resources } = await container.items.readAll().fetchAll();
      return resources;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw new Error('Failed to fetch templates: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async getTemplate(id: string): Promise<Template | null> {
    try {
      const container = await this.getContainer(this.templatesContainer);
      const { resource } = await container.item(id, id).read();
      return resource || null;
    } catch (error) {
      if ((error as any).code === 404) {
        return null;
      }
      console.error('Error fetching template:', error);
      throw new Error('Failed to fetch template: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async createTemplate(template: Omit<Template, 'id'>): Promise<Template> {
    try {
      const container = await this.getContainer(this.templatesContainer);
      const newTemplate = {
        ...template,
        id: crypto.randomUUID()
      };
      const { resource } = await container.items.create(newTemplate);
      return resource;
    } catch (error) {
      console.error('Error creating template:', error);
      throw new Error('Failed to create template: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async updateTemplate(id: string, template: Partial<Template>): Promise<Template> {
    try {
      const container = await this.getContainer(this.templatesContainer);
      const { resource: existingTemplate } = await container.item(id, id).read();
      
      if (!existingTemplate) {
        throw new Error(`Template with id ${id} not found`);
      }

      const updatedTemplate = {
        ...existingTemplate,
        ...template,
        id // Ensure ID remains unchanged
      };

      const { resource } = await container.item(id, id).replace(updatedTemplate);
      return resource;
    } catch (error) {
      console.error('Error updating template:', error);
      throw new Error('Failed to update template: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async deleteTemplate(id: string): Promise<void> {
    try {
      const container = await this.getContainer(this.templatesContainer);
      await container.item(id, id).delete();
    } catch (error) {
      if ((error as any).code !== 404) { // Ignore 404 errors when deleting
        console.error('Error deleting template:', error);
        throw new Error('Failed to delete template: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  }
}