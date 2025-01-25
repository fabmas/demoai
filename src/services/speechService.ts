import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

export class SpeechService {
  private speechConfig: speechsdk.SpeechConfig;

  constructor() {
    const subscriptionKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
    const region = import.meta.env.VITE_AZURE_SPEECH_REGION;

    if (!subscriptionKey || !region) {
      throw new Error('Azure Speech configuration is missing');
    }

    this.speechConfig = speechsdk.SpeechConfig.fromSubscription(subscriptionKey, region);
    this.speechConfig.speechRecognitionLanguage = 'it-IT';
  }

  async testSpeechService(): Promise<string> {
    return new Promise((resolve, reject) => {
      const synthesizer = new speechsdk.SpeechSynthesizer(this.speechConfig);
      const testPhrase = "This is a test of Azure Speech Service.";
      
      synthesizer.speakTextAsync(
        testPhrase,
        result => {
          if (result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
            resolve("Speech service test successful: Audio synthesis completed");
          } else {
            reject(new Error(`Speech synthesis failed: ${result.reason}`));
          }
          synthesizer.close();
        },
        error => {
          synthesizer.close();
          reject(new Error(`Speech service error: ${error}`));
        });
    });
  }

  private validateAudioFile(file: File): void {
    const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/webm', 'audio/m4a'];
    if (!validTypes.includes(file.type)) {
      throw new Error(`Unsupported audio format: ${file.type}. Supported formats are: WAV, MP3, M4A, and WebM`);
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size of 100MB`);
    }
  }

  async transcribeFromFile(file: File, onProgress?: (text: string) => void): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        this.validateAudioFile(file);
        const reader = new FileReader();
      
        reader.onload = async () => {
          try {
            const audioData = reader.result as ArrayBuffer;
            const pushStream = speechsdk.AudioInputStream.createPushStream();
            
            // Push the audio data to the stream in chunks
            const chunkSize = 32 * 1024; // 32KB chunks
            const view = new Int8Array(audioData);
            for (let i = 0; i < view.length; i += chunkSize) {
              const chunk = view.slice(i, i + chunkSize);
              pushStream.write(chunk.buffer);
            }
            pushStream.close();
            
            const audioConfig = speechsdk.AudioConfig.fromStreamInput(pushStream);
            const recognizer = new speechsdk.SpeechRecognizer(this.speechConfig, audioConfig);
            
            let transcription = '';
            let hasRecognizedSpeech = false;

            recognizer.recognized = (_, event) => {
              if (event.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
                hasRecognizedSpeech = true;
                const text = event.result.text;
                transcription += text + ' ';
                onProgress?.(transcription.trim());
              }
            };

            recognizer.recognizing = (_, event) => {
              if (event.result.reason === speechsdk.ResultReason.RecognizingSpeech) {
                onProgress?.(`${transcription} ${event.result.text}`);
              }
            };

            recognizer.canceled = (_, event) => {
              if (event.reason === speechsdk.CancellationReason.Error) {
                reject(new Error(`Recognition canceled: ${event.errorDetails}`));
              }
            };

            // Use fast transcription and diarization
            recognizer.startContinuousRecognitionAsync();
            recognizer.recognized = (s, e) => {
              if (e.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
                transcription += e.result.text + ' ';
                onProgress?.(transcription.trim());
              }
            };

            recognizer.canceled = (s, e) => {
              if (e.reason === speechsdk.CancellationReason.Error) {
                reject(new Error(`Recognition canceled: ${e.errorDetails}`));
              }
            };

            recognizer.sessionStopped = () => {
              resolve(transcription.trim());
              recognizer.stopContinuousRecognitionAsync();
            };
          } catch (error) {
            reject(new Error(`Audio processing error: ${error instanceof Error ? error.message : 'Unknown error'}`));
          }
        };

        reader.onerror = () => {
          reject(new Error(`Failed to read audio file: ${reader.error?.message || 'Unknown error'}`));
        };

        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject(error);
      }
    });
  }
}
