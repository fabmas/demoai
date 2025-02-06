import { Recording } from '../types';
import { CosmosService, Transcription } from './cosmosService';

export interface TranscriptionData extends Recording {
  URL_TranscriptionAudio: string;
  URL_TranscriptionTXT: string;
  URL_TranscriptionJSON: string;
  Speakers: string[];
  custom_prompts: string[];
}

export class StorageService {
  private cosmosService: CosmosService;
  private initialized: boolean = false;

  constructor() {
    this.cosmosService = new CosmosService();
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.cosmosService.initialize();
      this.initialized = true;
    }
  }

  private mapToCosmosTranscription(data: TranscriptionData): Omit<Transcription, 'id'> {
    return {
      name: data.name,
      date: data.date,
      status: data.status,
      reviewStatus: data.reviewStatus,
      language: data.language,
      confidence: data.confidence,
      blobAudio: data.URL_TranscriptionAudio,
      blobJson: data.URL_TranscriptionJSON,
      blobTxt: data.URL_TranscriptionTXT,
      speakers: data.Speakers.map(name => ({ name })),
      prompts: data.custom_prompts.map(prompt => ({
        name: 'Custom Prompt',
        prompt,
        blobPrompt: ''
      }))
    };
  }

  private mapFromCosmosTranscription(data: Transcription): TranscriptionData {
    return {
      id: data.id,
      name: data.name,
      date: data.date,
      status: data.status,
      reviewStatus: data.reviewStatus,
      language: data.language || 'it-IT',
      confidence: data.confidence || 0,
      duration: 0,
      fileSize: 0,
      URL_TranscriptionAudio: data.blobAudio || '',
      URL_TranscriptionJSON: data.blobJson || '',
      URL_TranscriptionTXT: data.blobTxt || '',
      Speakers: (data.speakers || []).map(speaker => speaker.name),
      custom_prompts: (data.prompts || []).map(prompt => prompt.prompt)
    };
  }

  async loadTranscriptions(): Promise<Record<string, TranscriptionData>> {
    try {
      await this.ensureInitialized();
      const transcriptions = await this.cosmosService.getTranscriptions();
      return transcriptions.reduce((acc, transcription) => {
        acc[transcription.id] = this.mapFromCosmosTranscription(transcription);
        return acc;
      }, {} as Record<string, TranscriptionData>);
    } catch (error) {
      console.error('Error loading transcriptions:', error);
      throw error;
    }
  }

  async createTranscription(transcription: TranscriptionData): Promise<void> {
    try {
      await this.ensureInitialized();
      const cosmosTranscription = {
        id: transcription.id,
        ...this.mapToCosmosTranscription(transcription)
      };
      await this.cosmosService.createTranscription(cosmosTranscription);
    } catch (error) {
      console.error('Error creating transcription:', error);
      throw error;
    }
  }

  async deleteTranscription(id: string): Promise<void> {
    try {
      await this.ensureInitialized();
      await this.cosmosService.deleteTranscription(id);
    } catch (error) {
      console.error('Error deleting transcription:', error);
      throw error;
    }
  }

  async updateTranscription(id: string, updates: Partial<TranscriptionData>): Promise<void> {
    try {
      await this.ensureInitialized();
      
      // Get the current transcription
      const currentTranscription = await this.cosmosService.getTranscription(id);
      if (!currentTranscription) {
        throw new Error(`Transcription with id ${id} not found`);
      }

      // Create a merged transcription object
      const mergedTranscription: Transcription = {
        ...currentTranscription,
        name: updates.name || currentTranscription.name,
        status: updates.status || currentTranscription.status,
        reviewStatus: updates.reviewStatus || currentTranscription.reviewStatus,
        language: updates.language || currentTranscription.language,
        confidence: updates.confidence || currentTranscription.confidence,
        blobAudio: updates.URL_TranscriptionAudio || currentTranscription.blobAudio,
        blobJson: updates.URL_TranscriptionJSON || currentTranscription.blobJson,
        blobTxt: updates.URL_TranscriptionTXT || currentTranscription.blobTxt,
        speakers: updates.Speakers ? updates.Speakers.map(name => ({ name })) : currentTranscription.speakers,
        prompts: updates.custom_prompts ? 
          updates.custom_prompts.map(prompt => ({
            name: 'Custom Prompt',
            prompt,
            blobPrompt: ''
          })) : 
          currentTranscription.prompts
      };

      await this.cosmosService.updateTranscription(id, mergedTranscription);
    } catch (error) {
      console.error('Error updating transcription:', error);
      throw error;
    }
  }
}