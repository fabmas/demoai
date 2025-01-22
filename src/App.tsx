import React, { useState } from 'react';
import { AudioRecorder } from './components/AudioRecorder';
import { TranscriptionsList } from './components/TranscriptionsList';
import type { Recording } from './types';

function App() {
  const [recordings] = useState<Recording[]>([
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

  const handleDelete = (id: string) => {
    console.log('Delete recording:', id);
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
          <AudioRecorder />
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