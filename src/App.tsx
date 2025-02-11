import React, { useState, useEffect } from 'react';
import { AudioRecorder } from './components/AudioRecorder';
import { TranscriptionsList } from './components/TranscriptionsList';
import { TranscriptionEditor } from './components/TranscriptionEditor';
import { InsightGenerator } from './components/InsightGenerator';
import { StorageService, TranscriptionData } from './services/storageService';
import { AzureStorageService } from './services/azureStorage';
import { RAGService } from './services/RAGService';
import type { Recording } from './types';

const storageService = new StorageService();
const azureStorage = new AzureStorageService();
const ragService = new RAGService();

export default function App() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedTranscription, setSelectedTranscription] = useState<TranscriptionData | null>(null);
  const [transcriptionJson, setTranscriptionJson] = useState<any>(null);
  const [showInsightGenerator, setShowInsightGenerator] = useState(false);
  const [selectedTranscriptionText, setSelectedTranscriptionText] = useState<string>('');
  const [selectedTranscriptionName, setSelectedTranscriptionName] = useState<string>('');
  const [showEditor, setShowEditor] = useState(false);
  const [hideAudioRecorderTranscription, setHideAudioRecorderTranscription] = useState(false);
  const [lastCreatedTranscriptionId, setLastCreatedTranscriptionId] = useState<string | null>(null);

  // useEffect(() => {
  //   const initializeServices = async () => {
  //     try {
  //       // Initialize RAG service with retries
  //       let retries = 3;
  //       while (retries > 0) {
  //         try {
  //           await ragService.initialize();
  //           break;
  //         } catch (error) {
  //           retries--;
  //           if (retries === 0) {
  //             throw error;
  //           }
  //           console.warn('Retrying RAG service initialization...');
  //           await new Promise(resolve => setTimeout(resolve, 2000));
  //         }
  //       }

  //       await loadTranscriptions();
  //     } catch (error) {
  //       console.error('Error initializing services:', error);
  //       // Consider showing a user-friendly error message here
  //     }
  //   };

  //   initializeServices();
  // }, []);
  
  useEffect(() => {
    loadTranscriptions();
  }, []);
  

  useEffect(() => {
    if (lastCreatedTranscriptionId) {
      const recording = recordings.find(r => r.id === lastCreatedTranscriptionId);
      if (recording && recording.status === 'completed') {
        handleEdit(lastCreatedTranscriptionId);
        setLastCreatedTranscriptionId(null);
      }
    }
  }, [recordings, lastCreatedTranscriptionId]);

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
        confidence: item.confidence,
        Speakers: item.Speakers
      }));
      setRecordings(recordingsList);
    } catch (error) {
      console.error('Error loading transcriptions:', error);
    }
  };

  const handleNewRecording = (name: string, fileSize: number) => {
    setHideAudioRecorderTranscription(true);
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
        fileSize: newRecording.fileSize,
        Speakers: []
      },
      ...prev
    ]);

    setLastCreatedTranscriptionId(newRecording.id);
    return newRecording;
  };

  const updateRecordingStatus = async (id: string, status: Recording['status'], confidence?: number) => {
    setRecordings(prev => prev.map(r => 
      r.id === id 
        ? { ...r, status, confidence }
        : r
    ));

    if (status === 'completed') {
      await loadTranscriptions();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setShowEditor(false);
      setShowInsightGenerator(false);
      setHideAudioRecorderTranscription(true);
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
      setShowInsightGenerator(false);
      setShowEditor(true);
      setHideAudioRecorderTranscription(true);
      const data = await storageService.loadTranscriptions();
      const recording = Object.values(data).find(r => r.id === id);
      
      if (recording && recording.URL_TranscriptionJSON) {
        setSelectedTranscription(recording);
        
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

  const handleGenerateInsight = async (id: string, name: string) => {
    try {
      setShowEditor(false);
      setShowInsightGenerator(true);
      setHideAudioRecorderTranscription(true);
      const data = await storageService.loadTranscriptions();
      const recording = Object.values(data).find(r => r.id === id);
      
      if (recording && recording.URL_TranscriptionJSON) {
        setSelectedTranscription(recording);
        setSelectedTranscriptionName(name);
        
        const blobName = recording.URL_TranscriptionJSON.split('/').pop();
        if (blobName) {
          const jsonBlob = await azureStorage.downloadBlob(blobName);
          const jsonData = JSON.parse(await jsonBlob.text());
          setSelectedTranscriptionText(jsonData.transcriptionText);
        }
      }
    } catch (error) {
      console.error('Error loading transcription for insight:', error);
      alert('Failed to load transcription. Please try again.');
    }
  };

  const handleEditorClose = () => {
    setSelectedTranscription(null);
    setTranscriptionJson(null);
    setShowEditor(false);
    setHideAudioRecorderTranscription(true); // Keep transcription hidden
    loadTranscriptions();
  };

  const handleInsightGeneratorClose = () => {
    setShowInsightGenerator(false);
    setSelectedTranscriptionText('');
    setHideAudioRecorderTranscription(true); // Keep transcription hidden
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
            hideTranscription={hideAudioRecorderTranscription}
          />
          <TranscriptionsList 
            recordings={recordings}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onGenerateInsight={handleGenerateInsight}
            selectedTranscriptionId={selectedTranscription?.id}
          />
          {showEditor && selectedTranscription && transcriptionJson && (
            <>
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
              <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto p-4">
                <div className="bg-white max-w-7xl w-full rounded-lg shadow-lg relative">
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
                    transcriptionId={selectedTranscription.id}
                    initialReviewStatus={selectedTranscription.reviewStatus === 'reviewed'}
                  />
                </div>
              </div>
            </>
          )}
          {showInsightGenerator && selectedTranscriptionText && selectedTranscription && (
            <>
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
              <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto p-4">
                <div className="bg-white max-w-7xl w-full rounded-lg shadow-lg relative">
                  <InsightGenerator
                    transcriptionId={selectedTranscription.id}
                    transcriptionText={selectedTranscriptionText}
                    recordingName={selectedTranscriptionName}
                    onClose={handleInsightGeneratorClose}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}