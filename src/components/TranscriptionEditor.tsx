import React, { useState, useEffect, useMemo } from 'react';
import { Edit2, X, Search, Save } from 'lucide-react';
import type { Speaker } from '../types';
import { AzureStorageService } from '../services/azureStorage';
import { StorageService } from '../services/storageService';

const speakerColors = [
  'bg-blue-500',   // Speaker 1
  'bg-orange-500', // Speaker 2
  'bg-green-500',  // Speaker 3
  'bg-purple-500', // Speaker 4
  'bg-pink-500',   // Speaker 5
  'bg-teal-500',   // Speaker 6
  'bg-red-500',    // Speaker 7
  'bg-indigo-500'  // Speaker 8
];

interface TranscriptionJson {
  phrases: Array<{
    speaker: number;
    text: string;
    offsetMilliseconds: number;
    durationMilliseconds: number;
  }>;
  transcriptionText: string;
}

interface TranscriptionEditorProps {
  transcription: string;
  onClose: () => void;
  fileName: string;
  fileSize: number;
  duration: number;
  language: string;
  confidence: number;
  lastUpdate: string;
  jsonUrl: string;
  transcriptionId: string;
  initialReviewStatus: boolean;
}

export function TranscriptionEditor({
  transcription,
  onClose,
  fileName,
  fileSize,
  duration,
  language,
  confidence,
  lastUpdate,
  jsonUrl,
  transcriptionId,
  initialReviewStatus
}: TranscriptionEditorProps) {
  const [title, setTitle] = useState(fileName.replace(/\.[^/.]+$/, ""));
  const [isEditing, setIsEditing] = useState(false);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isReviewed, setIsReviewed] = useState(initialReviewStatus);
  const [searchQuery, setSearchQuery] = useState('');
  const [transcriptionJson, setTranscriptionJson] = useState<TranscriptionJson | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const storageService = new StorageService();
  const azureStorage = new AzureStorageService();

  // Aggiorna il titolo quando cambia il fileName
  useEffect(() => {
    setTitle(fileName.replace(/\.[^/.]+$/, ""));
  }, [fileName]);

  useEffect(() => {
    loadTranscriptionJson();
  }, [jsonUrl]);

  useEffect(() => {
    setIsReviewed(initialReviewStatus);
  }, [initialReviewStatus]);

  const loadTranscriptionJson = async () => {
    try {
      const blobName = jsonUrl.split('/').pop();
      if (blobName) {
        const jsonBlob = await azureStorage.downloadBlob(blobName);
        const jsonData: TranscriptionJson = JSON.parse(await jsonBlob.text());
        setTranscriptionJson(jsonData);

        // Extract unique speakers
        const uniqueSpeakers = Array.from(new Set(jsonData.phrases.map(p => p.speaker)))
          .map(speakerNum => ({
            id: speakerNum.toString(),
            name: `Speaker ${speakerNum}`,
            initial: `S${speakerNum}`
          }));
        setSpeakers(uniqueSpeakers);
      }
    } catch (error) {
      console.error('Error loading transcription JSON:', error);
    }
  };

  // Filter phrases based on search query
  const filteredPhrases = useMemo(() => {
    if (!transcriptionJson || !searchQuery.trim()) {
      return transcriptionJson?.phrases || [];
    }

    const query = searchQuery.toLowerCase().trim();
    return transcriptionJson.phrases.filter(phrase => 
      phrase.text.toLowerCase().includes(query)
    );
  }, [transcriptionJson, searchQuery]);

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MiB`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleSpeakerNameChange = (id: string, newName: string) => {
    setSpeakers(speakers.map(speaker => 
      speaker.id === id 
        ? { ...speaker, name: newName, initial: newName.split(' ').map(n => n[0]).join('') }
        : speaker
    ));
  };

  const handleSave = async () => {
    if (!transcriptionId) {
      console.error('No transcription ID available');
      alert('Unable to save changes: Missing transcription ID');
      return;
    }

    try {
      setIsSaving(true);

      // Update transcription JSON with new speaker names
      if (transcriptionJson) {
        const updatedJson = {
          ...transcriptionJson,
          speakers: speakers.map(s => ({ id: s.id, name: s.name }))
        };

        // Get the original blob name from the URL
        const blobName = jsonUrl.split('/').pop();
        if (!blobName) {
          throw new Error('Could not extract blob name from URL');
        }

        // Upload updated JSON
        const jsonBlob = new Blob([JSON.stringify(updatedJson, null, 2)], { type: 'application/json' });
        const jsonFile = new File([jsonBlob], blobName, { type: 'application/json' });
        await azureStorage.uploadFile(jsonFile);

        // Update Cosmos DB record
        await storageService.updateTranscription(transcriptionId, {
          id: transcriptionId,
          name: title,
          date: lastUpdate,
          status: 'completed',
          reviewStatus: isReviewed ? 'reviewed' : 'draft',
          language: language,
          confidence: confidence,
          duration: duration,
          fileSize: fileSize,
          URL_TranscriptionAudio: '', // Preserved from existing record
          URL_TranscriptionTXT: '', // Preserved from existing record
          URL_TranscriptionJSON: jsonUrl,
          Speakers: speakers.map(s => s.name),
          custom_prompts: [] // Preserved from existing record
        });

        onClose();
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold px-2 py-1 border rounded"
            autoFocus
          />
        ) : (
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {title}
            <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-gray-700">
              <Edit2 size={16} />
            </button>
          </h2>
        )}
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      {/* Audio Player */}
      <div className="p-4 border-b bg-gray-50">
        <div className="h-8 bg-gray-200 rounded-full"></div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6 p-6">
        {/* Left Column - File Info */}
        <div className="col-span-2 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Informazioni file</h3>
            <div className="space-y-2 text-sm">
              <p>File: {fileName}</p>
              <p>Dimensione: {formatFileSize(fileSize)}</p>
              <p>Durata audio: {formatDuration(duration)}</p>
              <p>Ultimo aggiornamento: {new Date(lastUpdate).toLocaleString()}</p>
              <p>Lingua: {language} (Confidence: {(confidence * 100).toFixed(0)}%)</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Cerca nella trascrizione"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            {searchQuery && (
              <div className="text-sm text-gray-600">
                {filteredPhrases.length} risultati trovati
              </div>
            )}
          </div>

          {/* Transcription */}
          <div className="h-[400px] overflow-y-auto border rounded-lg bg-white">
            <div className="space-y-4 p-4">
              {filteredPhrases.map((phrase, index) => (
                <div key={index} className="flex gap-4 items-start p-2 hover:bg-gray-50 rounded">
                  <div className={`w-10 h-10 rounded-full ${speakerColors[(phrase.speaker - 1) % speakerColors.length]} flex items-center justify-center text-white font-semibold`}>
                    {speakers.find(s => s.id === phrase.speaker.toString())?.initial || `S${phrase.speaker}`}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {speakers.find(s => s.id === phrase.speaker.toString())?.name || `Speaker ${phrase.speaker}`}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({formatDuration(Math.floor(phrase.offsetMilliseconds / 1000))})
                      </span>
                    </div>
                    <p className="text-gray-700">{phrase.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Speakers */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Voci individuate ({speakers.length})</h3>
            </div>
            <div className="max-h-[200px] overflow-y-auto space-y-3">
              {speakers.map((speaker, index) => (
                <div key={speaker.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${speakerColors[index % speakerColors.length]} flex items-center justify-center text-white font-semibold`}>
                    {speaker.initial}
                  </div>
                  <input
                    type="text"
                    value={speaker.name}
                    onChange={(e) => handleSpeakerNameChange(speaker.id, e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Stato revisione</h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isReviewed}
                onChange={(e) => setIsReviewed(e.target.checked)}
                className="form-checkbox"
              />
              <span>Revisionata</span>
            </label>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg ${
              isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            <Save size={20} />
            {isSaving ? 'Salvataggio...' : 'Salva modifiche'}
          </button>
        </div>
      </div>
    </div>
  );
}