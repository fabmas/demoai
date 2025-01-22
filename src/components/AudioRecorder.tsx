import React, { useState, useRef } from 'react';
import { Mic, Square, Upload, AlertCircle } from 'lucide-react';
import { AzureStorageService } from '../services/azureStorage';

const azureStorage = new AzureStorageService();

export function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      const chunks: Blob[] = [];
      mediaRecorder.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
        await handleFileUpload(file);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setError(null);
      
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

      // Validate file type
      const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/webm', 'audio/m4a'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload an audio file (WAV, MP3, M4A, or WebM).');
      }

      // Validate file size (max 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB in bytes
      if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 100MB.');
      }

      const blobUrl = await azureStorage.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      console.log('File uploaded successfully:', blobUrl);
      // Here you would typically notify the parent component about the successful upload
      // and provide the blob URL for further processing

      setUploadProgress(null);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during upload.');
      setUploadProgress(null);
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
        </div>

        {uploadProgress !== null && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
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