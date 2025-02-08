import React, { useState, useRef } from 'react';
import { Mic, Square, Upload, AlertCircle } from 'lucide-react';
import { AzureStorageService } from '../services/azureStorage';
import { SpeechService } from '../services/speechService';
import { TranscriptionEditor } from './TranscriptionEditor';
import type { Recording } from '../types';
import type { TranscriptionData } from '../services/storageService';

const azureStorage = new AzureStorageService();
const speechService = new SpeechService();

interface AudioRecorderProps {
  onNewRecording: (name: string, fileSize: number) => TranscriptionData;
  onUpdateStatus: (id: string, status: Recording['status'], confidence?: number) => void;
  hideTranscription: boolean;
}

export function AudioRecorder({ onNewRecording, onUpdateStatus, hideTranscription }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcriptionProgress, setTranscriptionProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number>();
  const currentRecordingRef = useRef<Recording | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [currentFileSize, setCurrentFileSize] = useState<number>(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
        const fileName = `recording-${Date.now()}.wav`;
        const file = new File([audioBlob], fileName, { type: 'audio/wav' });
        setCurrentFileName(fileName);
        setCurrentFileSize(file.size);
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
      setTranscriptionProgress(null);
      setCurrentFileName(file.name);
      setCurrentFileSize(file.size);
      setIsProcessing(true);

      // Create new recording entry with processing status
      setProcessingStep('Initializing...');
      const newRecording = onNewRecording(file.name, file.size);
      currentRecordingRef.current = newRecording;

      // Start transcription
      setProcessingStep('Transcribing audio...');
      const transcription = await speechService.transcribeFromFile(
        file,
        newRecording.id,
        (progress) => {
          if (typeof progress === 'string' && progress.includes('%')) {
            // Extract percentage from progress message if available
            const percentage = progress.match(/(\d+)%/);
            if (percentage) {
              setProcessingStep(`Transcribing audio... ${percentage[1]}%`);
            } else {
              setProcessingStep('Transcribing audio...');
            }
          } else {
            setProcessingStep('Processing transcription...');
          }
          setTranscriptionProgress(progress);
        }
      );

      // Update status to completed only after successful transcription
      setProcessingStep('Finalizing...');
      onUpdateStatus(newRecording.id, 'completed');
      setTranscriptionProgress(transcription);
      setIsProcessing(false);
      setProcessingStep('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during processing.';
      console.error('Processing error:', errorMessage);
      if (currentRecordingRef.current) {
        onUpdateStatus(currentRecordingRef.current.id, 'failed');
      }
      setError(errorMessage);
      setTranscriptionProgress(null);
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleEditorClose = () => {
    setShowEditor(false);
  };

  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Acquisizione Audio</h2>
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
                disabled={isProcessing}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg ${
                  isProcessing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                <Mic size={20} />
                Avvia registrazione
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                <Square size={20} />
                Interrompi registrazione
              </button>
            )}
            
            <label className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg ${
              isProcessing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 cursor-pointer'
            }`}>
              <Upload size={20} />
              Carica Audio
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                disabled={isProcessing}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                }}
              />
            </label>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{processingStep}</span>
                <div className="animate-pulse">
                  <span>Please wait...</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
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

      {showEditor && transcriptionProgress && (
        <TranscriptionEditor
          transcription={transcriptionProgress}
          onClose={handleEditorClose}
          fileName={currentFileName}
          fileSize={currentFileSize}
          duration={duration || 0}
          language="Italian"
          confidence={0.99}
          lastUpdate={new Date().toISOString()}
        />
      )}
    </>
  );
}