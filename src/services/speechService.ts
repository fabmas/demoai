import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import { AzureStorageService } from './azureStorage';
import { StorageService } from './storageService';

interface TranscriptionPhrase {
  channel: number;
  speaker: number;
  offsetMilliseconds: number;
  durationMilliseconds: number;
  text: string;
}

export class SpeechService {
  private subscriptionKey: string;
  private region: string;
  private speechConfig: speechsdk.SpeechConfig;
  private storageService: StorageService;
  private azureStorageService: AzureStorageService;

  constructor() {
    this.subscriptionKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
    this.region = import.meta.env.VITE_AZURE_SPEECH_REGION;
    this.storageService = new StorageService();
    this.azureStorageService = new AzureStorageService();

    if (!this.subscriptionKey || !this.region) {
      throw new Error('Azure Speech configuration is missing');
    }

    this.speechConfig = speechsdk.SpeechConfig.fromSubscription(this.subscriptionKey, this.region);
    this.speechConfig.speechRecognitionLanguage = 'it-IT';
  }

  private validateAudioFile(file: File): void {
    const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/webm', 'audio/m4a'];
    if (!validTypes.includes(file.type)) {
      throw new Error(`Unsupported audio format: ${file.type}. Supported formats are: WAV, MP3, M4A, and WebM`);
    }

    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
      throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size of 200MB`);
    }
  }

  async transcribeFromFile(file: File, transcriptionId: string, onProgress?: (text: string) => void): Promise<string> {
    this.validateAudioFile(file);
    let audioUrl = '';
    let txtUrl = '';
    let jsonUrl = '';

    try {
      // Step 1: Upload audio file
      if (onProgress) onProgress('Uploading audio file...');
      const audioUpload = await this.azureStorageService.uploadFile(file);
      audioUrl = audioUpload.url;

      // Step 2: Process transcription
      if (onProgress) onProgress('Processing audio file...');
      const formData = new FormData();
      formData.append('audio', file);

      const definition = {
        locales: ['it-IT'],
        diarization: {
          enabled: true,
          maxSpeakers: 2
        }
      };

      formData.append('definition', JSON.stringify(definition));

      const response = await fetch(`https://${this.region}.api.cognitive.microsoft.com/speechtotext/transcriptions:transcribe?api-version=2024-11-15`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const result = await response.json();
      const phrases: TranscriptionPhrase[] = result.phrases;

      // Step 3: Format transcription
      if (onProgress) onProgress('Formatting transcription...');
      const transcriptionWithDetails = this.formatTranscription(phrases);

      // Step 4: Upload text and JSON files
      if (onProgress) onProgress('Saving transcription files...');
      const [txtUpload, jsonUpload] = await Promise.all([
        this.uploadTranscriptionText(file.name, transcriptionWithDetails),
        this.uploadTranscriptionJson(file.name, phrases, transcriptionWithDetails)
      ]);
      txtUrl = txtUpload.url;
      jsonUrl = jsonUpload.url;

      // Step 5: Create Cosmos DB record only when everything is complete
      if (onProgress) onProgress('Finalizing transcription...');
      await this.storageService.createTranscription({
        id: transcriptionId,
        name: file.name,
        status: 'completed',
        reviewStatus: 'draft',
        date: new Date().toISOString().split('T')[0],
        duration: Math.floor(phrases[phrases.length - 1].offsetMilliseconds / 1000),
        fileSize: file.size,
        language: 'it-IT',
        confidence: 0.95,
        URL_TranscriptionAudio: audioUrl,
        URL_TranscriptionTXT: txtUrl,
        URL_TranscriptionJSON: jsonUrl,
        Speakers: [],
        custom_prompts: []
      });

      if (onProgress) onProgress(transcriptionWithDetails);
      return transcriptionWithDetails;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Processing error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  private formatTranscription(phrases: TranscriptionPhrase[]): string {
    return phrases.map((phrase: TranscriptionPhrase) => {
      const startTime = this.formatTime(phrase.offsetMilliseconds);
      const endTime = this.formatTime(phrase.offsetMilliseconds + phrase.durationMilliseconds);
      return `Speaker ${phrase.speaker} [${startTime} - ${endTime}]: "${phrase.text}"`;
    }).join('\n');
  }

  private formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}.${String(minutes).padStart(2, '0')}.${String(seconds).padStart(2, '0')}`;
  }

  private async uploadTranscriptionText(fileName: string, transcription: string): Promise<{ url: string }> {
    const transcriptionBlob = new Blob([transcription], { type: 'text/plain' });
    const transcriptionFile = new File([transcriptionBlob], `${fileName}.txt`, { type: 'text/plain' });
    return this.azureStorageService.uploadFile(transcriptionFile);
  }

  private async uploadTranscriptionJson(
    fileName: string, 
    phrases: TranscriptionPhrase[], 
    transcriptionText: string
  ): Promise<{ url: string }> {
    const transcriptionData = {
      phrases: phrases,
      transcriptionText: transcriptionText,
    };
    const jsonBlob = new Blob([JSON.stringify(transcriptionData, null, 2)], { type: 'application/json' });
    const jsonFile = new File([jsonBlob], `${fileName}.json`, { type: 'application/json' });
    return this.azureStorageService.uploadFile(jsonFile);
  }
}