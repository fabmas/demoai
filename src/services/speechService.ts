import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import { AzureStorageService } from './azureStorage'; // Importing AzureStorageService

interface TranscriptionPhrase {
  channel: number;
  speaker: number; // ID del relatore
  offsetMilliseconds: number; // Offset in millisecondi
  durationMilliseconds: number; // Durata in millisecondi
  text: string; // Testo della frase
}

export class SpeechService {
  private subscriptionKey: string;
  private region: string;
  private speechConfig: speechsdk.SpeechConfig;

  constructor() {
    this.subscriptionKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
    this.region = import.meta.env.VITE_AZURE_SPEECH_REGION;

    if (!this.subscriptionKey || !this.region) {
      throw new Error('Azure Speech configuration is missing');
    }

    this.speechConfig = speechsdk.SpeechConfig.fromSubscription(this.subscriptionKey, this.region);
    this.speechConfig.speechRecognitionLanguage = 'it-IT'; // Imposta la lingua di riconoscimento
  }

  async testSpeechService(): Promise<string> {
    return new Promise((resolve, reject) => {
      const synthesizer = new speechsdk.SpeechSynthesizer(this.speechConfig);
      const testPhrase = "Questo è un test del servizio di sintesi vocale di Azure.";
      
      synthesizer.speakTextAsync(
        testPhrase,
        result => {
          if (result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
            resolve("Test del servizio di sintesi vocale riuscito: Sintesi audio completata");
          } else {
            reject(new Error(`Sintesi vocale fallita: ${result.reason}`));
          }
          synthesizer.close();
        },
        error => {
          synthesizer.close();
          reject(new Error(`Errore nel servizio di sintesi vocale: ${error}`));
        });
    });
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

  async transcribeFromFile(file: File, onProgress?: (text: string) => void): Promise<string> {
    this.validateAudioFile(file);

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

    // Helper function to convert milliseconds to HH.MM.SS format
    function formatTime(milliseconds: number): string {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${String(hours).padStart(2, '0')}.${String(minutes).padStart(2, '0')}.${String(seconds).padStart(2, '0')}`;
    }

    const transcriptionWithDetails = phrases.map((phrase: TranscriptionPhrase) => {
      const startTime = formatTime(phrase.offsetMilliseconds);
      const endTime = formatTime(phrase.offsetMilliseconds + phrase.durationMilliseconds);
      return `Speaker ${phrase.speaker} [${startTime} - ${endTime}]: "${phrase.text}"`;
    }).join('\n');

    const transcriptionData = {
      phrases: phrases,
      transcriptionText: transcriptionWithDetails,
    };
    const jsonBlob = new Blob([JSON.stringify(transcriptionData)], { type: 'application/json' });
    const azureStorageService = new AzureStorageService();
    await azureStorageService.uploadFile(jsonBlob, (progress) => {
      console.log(`Upload progress: ${progress}%`);
    });

    // Se onProgress è fornito, chiama la funzione con la trascrizione
    if (onProgress) {
        onProgress(transcriptionWithDetails);
    }

    return transcriptionWithDetails;
  }
}
