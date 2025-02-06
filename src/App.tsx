import React, { useState, useEffect } from 'react';
import { AudioRecorder } from './components/AudioRecorder';
import { TranscriptionsList } from './components/TranscriptionsList';
import { TranscriptionEditor } from './components/TranscriptionEditor';
import { StorageService, TranscriptionData } from './services/storageService';
import { AzureStorageService } from './services/azureStorage';
import type { Recording } from './types';

const storageService = new StorageService();
const azureStorage = new AzureStorageService();

export default function App() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedTranscription, setSelectedTranscription] = useState<TranscriptionData | null>(null);
  const [transcriptionJson, setTranscriptionJson] = useState<any>(null);

  useEffect(() => {
    loadTranscriptions();
  }, []);

  const loadTranscriptions = async () => {
    try {
      const data = await storageService.loadTranscriptions();
      const recordingsList = Object.values(data).map(item => ({
        id: item.id,
        name: item.name,
        status: item.status,
        reviewStatus: item.reviewStatus,
        date: item.date,
        duration: item.duration,
        fileSize: item.fileSize,
        language: item.language,
        confidence: item.confidence
      }));
      setRecordings(recordingsList);
    } catch (error) {
      console.error('Error loading transcriptions:', error);
    }
  };

  const handleNewRecording = (name: string, fileSize: number) => {
    const newRecording: TranscriptionData = {
      id: crypto.randomUUID(),
      name,
      status: 'processing',
      reviewStatus: 'draft',
      date: new Date().toISOString().split('T')[0],
      fileSize,
      URL_TranscriptionAudio: '',
      URL_TranscriptionTXT: '',
      URL_TranscriptionJSON: '',
      Speakers: [],
      custom_prompts: []
    };

    setRecordings(prev => [
      {
        id: newRecording.id,
        name: newRecording.name,
        status: newRecording.status,
        reviewStatus: newRecording.reviewStatus,
        date: newRecording.date,
        fileSize: newRecording.fileSize
      },
      ...prev
    ]);

    return newRecording;
  };

  const updateRecordingStatus = async (id: string, status: Recording['status'], confidence?: number) => {
    setRecordings(prev => prev.map(r => 
      r.id === id 
        ? { ...r, status, confidence }
        : r
    ));

    // Only reload transcriptions when status is completed to show the final record
    if (status === 'completed') {
      await loadTranscriptions();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await storageService.deleteTranscription(id);
      setRecordings(prev => prev.filter(r => r.id !== id));
      if (selectedTranscription?.id === id) {
        setSelectedTranscription(null);
        setTranscriptionJson(null);
      }
    } catch (error) {
      console.error('Error deleting recording:', error);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const data = await storageService.loadTranscriptions();
      const recording = Object.values(data).find(r => r.id === id);
      
      if (recording && recording.URL_TranscriptionJSON) {
        setSelectedTranscription(recording);
        
        // Extract the blob name from the URL
        const blobName = recording.URL_TranscriptionJSON.split('/').pop();
        if (blobName) {
          const jsonBlob = await azureStorage.downloadBlob(blobName);
          const jsonData = JSON.parse(await jsonBlob.text());
          setTranscriptionJson(jsonData);
        }
      }
    } catch (error) {
      console.error('Error loading transcription:', error);
      alert('Failed to load transcription. Please try again.');
    }
  };

  const handleEditorClose = () => {
    setSelectedTranscription(null);
    setTranscriptionJson(null);
    loadTranscriptions(); // Refresh the list to show any updates
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Audio Transcription Platform</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <AudioRecorder 
            onNewRecording={handleNewRecording}
            onUpdateStatus={updateRecordingStatus}
          />
          <TranscriptionsList 
            recordings={recordings}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
          {selectedTranscription && transcriptionJson && (
            <TranscriptionEditor
              transcription={transcriptionJson.transcriptionText}
              onClose={handleEditorClose}
              fileName={selectedTranscription.name}
              fileSize={selectedTranscription.fileSize || 0}
              duration={selectedTranscription.duration || 0}
              language={selectedTranscription.language || 'Italian'}
              confidence={selectedTranscription.confidence || 0}
              lastUpdate={selectedTranscription.date}
              jsonUrl={selectedTranscription.URL_TranscriptionJSON}
            />
          )}
        </div>
      </main>
    </div>
  );
}