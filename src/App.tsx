import React, { useState } from 'react';
import { AudioRecorder } from './components/AudioRecorder';
import { TranscriptionsList } from './components/TranscriptionsList';
import type { Recording } from './types';

function App() {
  const [recordings, setRecordings] = useState<Recording[]>([
    {
      id: '1',
      name: 'Meeting Recording 1',
      status: 'completed',
      reviewStatus: 'reviewed',
      date: '2024-02-20',
      duration: 1800,
      fileSize: 15000000,
      language: 'en',
      confidence: 0.95
    },
    {
      id: '2',
      name: 'Interview Session',
      status: 'processing',
      reviewStatus: 'draft',
      date: '2024-02-21'
    }
  ]);

  const handleNewRecording = (name: string, fileSize: number) => {
    const newRecording: Recording = {
      id: crypto.randomUUID(),
      name,
      status: 'processing',
      reviewStatus: 'draft',
      date: new Date().toISOString().split('T')[0],
      fileSize
    };
    setRecordings(prev => [newRecording, ...prev]);
    return newRecording;
  };

  const updateRecordingStatus = (id: string, status: Recording['status'], confidence?: number) => {
    setRecordings(prev => prev.map(recording => 
      recording.id === id 
        ? { ...recording, status, confidence }
        : recording
    ));
  };

  const handleDelete = (id: string) => {
    setRecordings(prev => prev.filter(recording => recording.id !== id));
  };

  const handleEdit = (id: string) => {
    console.log('Edit recording:', id);
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
        </div>
      </main>
    </div>
  );
}

export default App;