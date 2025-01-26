import React, { useState, useRef } from 'react';
import { Mic, Square, Upload, AlertCircle, TestTube, Play, Pause, FileText } from 'lucide-react';
import { AzureStorageService } from '../services/azureStorage';
import { SpeechService } from '../services/speechService';
import type { Recording } from '../types';

const azureStorage = new AzureStorageService();
const speechService = new SpeechService();

export interface AudioRecorderProps {
  onNewRecording: (name: string, fileSize: number) => Recording;
  onUpdateStatus: (id: string, status: Recording['status'], confidence?: number) => void;
}

export function AudioRecorder({ onNewRecording, onUpdateStatus }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [transcriptionProgress, setTranscriptionProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number>();
  const currentRecordingRef = useRef<Recording | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const testBlobRef = useRef<Blob | null>(null);

  const testSpeechService = async () => {
    try {
      setError(null);
      setTestResult("Loading audio file from storage...");
      setTranscriptionProgress(null);
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const blob = await azureStorage.downloadBlob('buscetta.wav');
      testBlobRef.current = blob;
      const audioUrl = URL.createObjectURL(blob);
      
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false);
        });
      } else {
        audioRef.current.src = audioUrl;
      }

      setTestResult("Audio file loaded. Click play/pause to control playback.");
    } catch (err) {
      console.error('Speech service test error:', err);
      setError(err instanceof Error ? err.message : 'Speech service test failed');
      setTestResult(null);
    }
  };

  const startTranscription = async () => {
    if (!testBlobRef.current) {
      setError('Please load the test audio file first');
      return;
    }

    try {
      setError(null);
      setIsTranscribing(true);
      setTranscriptionProgress('Generating transcription...');

      // Create a File object from the Blob
      const file = new File([testBlobRef.current], 'buscetta.', {
        type: testBlobRef.current.type
      });

      const transcription = await speechService.transcribeFromFile(
        file,
        (progress) => setTranscriptionProgress(progress)
      );

      // Save transcription to a text file
      const transcriptionBlob = new Blob([transcription], { type: 'text/plain' });
      const transcriptionFile = new File([transcriptionBlob], 'transcription.txt', { type: 'text/plain' });

      // Upload the transcription file to Azure Storage
      await azureStorage.uploadFile(transcriptionFile, (progress) => {
        setUploadProgress(progress);
      });

      setTranscriptionProgress(transcription);
    } catch (err) {
      console.error('Transcription error:', err);
      setError(err instanceof Error ? err.message : 'Transcription failed');
    } finally {
      setIsTranscribing(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      const chunks: Blob[] = [];
      mediaRecorder.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
        await handleFileUpload(file);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setError(null);
      setTranscriptionProgress(null);
      
      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
      setDuration(0);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setError(null);
      setUploadProgress(0);
      setTranscriptionProgress(null);

      // Create new recording entry
      currentRecordingRef.current = onNewRecording(file.name, file.size);

      // Upload file to Azure Storage
      const blobUrl = await azureStorage.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      // Start transcription
      setTranscriptionProgress('Starting transcription...');
      const transcription = await speechService.transcribeFromFile(file, (progress) => {
        setTranscriptionProgress(progress);
      });

      // Immediately save the transcription to Azure Storage
      const transcriptionBlob = new Blob([transcription], { type: 'text/plain' });
      const transcriptionFile = new File([transcriptionBlob], 'transcription.txt', { type: 'text/plain' });
      await azureStorage.uploadFile(transcriptionFile, (progress) => {
        setUploadProgress(progress);
      });

      // Update recording status
      if (currentRecordingRef.current) {
        onUpdateStatus(currentRecordingRef.current.id, 'completed', 0.95);
      }

      setUploadProgress(null);
      setTranscriptionProgress(transcription);
    } catch (err) {
      console.error('Processing error:', err);
      if (currentRecordingRef.current) {
        onUpdateStatus(currentRecordingRef.current.id, 'failed');
      }
      setError(err instanceof Error ? err.message : 'An error occurred during processing.');
      setUploadProgress(null);
      setTranscriptionProgress(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Audio Recorder</h2>
        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-mono">{formatTime(duration)}</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              <Mic size={20} />
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              <Square size={20} />
              Stop Recording
            </button>
          )}
          
          <label className="flex items-center gap-2 px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 cursor-pointer">
            <Upload size={20} />
            Upload Audio
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file);
                }
              }}
            />
          </label>

          <button
            onClick={testSpeechService}
            className="flex items-center gap-2 px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600"
          >
            <TestTube size={20} />
            Load Test Audio
          </button>

          {testResult && (
            <>
              <button
                onClick={togglePlayback}
                className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <button
                onClick={startTranscription}
                disabled={isTranscribing}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg ${
                  isTranscribing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-teal-500 hover:bg-teal-600'
                }`}
              >
                <FileText size={20} />
                {isTranscribing ? 'Transcribing...' : 'Transcribe'}
              </button>
            </>
          )}
        </div>

        {uploadProgress !== null && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Uploading: {uploadProgress}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {testResult && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Test Result</h3>
            <p className="text-green-700">{testResult}</p>
          </div>
        )}

        {transcriptionProgress && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg overflow-y-auto" style={{ maxHeight: '200px' }}>            
            <h3 className="text-lg font-semibold mb-2">Transcription</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{transcriptionProgress}</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
