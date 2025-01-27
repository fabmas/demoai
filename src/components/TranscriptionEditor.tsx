import React, { useState } from 'react';
import { Edit2, X, Search, Save } from 'lucide-react';
import type { Speaker } from '../types';

interface TranscriptionEditorProps {
  transcription: string;
  onClose: () => void;
  fileName: string;
  fileSize: number;
  duration: number;
  language: string;
  confidence: number;
  lastUpdate: string;
}

export function TranscriptionEditor({
  transcription,
  onClose,
  fileName,
  fileSize,
  duration,
  language,
  confidence,
  lastUpdate
}: TranscriptionEditorProps) {
  const [title, setTitle] = useState("Intervista a Tommaso Buscetta");
  const [isEditing, setIsEditing] = useState(false);
  const [speakers, setSpeakers] = useState<Speaker[]>([
    { id: 'MS', name: 'Michele Santoro', initial: 'MS' },
    { id: 'TB', name: 'Tommaso Buscetta', initial: 'TB' }
  ]);
  const [isReviewed, setIsReviewed] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

          {/* Search and Controls */}
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
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showConversation}
                  onChange={(e) => setShowConversation(e.target.checked)}
                  className="form-checkbox"
                />
                <span>Mostra conversazione</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showConfidence}
                  onChange={(e) => setShowConfidence(e.target.checked)}
                  className="form-checkbox"
                />
                <span>Mostra confidence analysis</span>
              </label>
            </div>
          </div>

          {/* Transcription - Now with fixed height and scrollbar */}
          <div className="h-[400px] overflow-y-auto border rounded-lg bg-white">
            <div className="space-y-4 p-4">
              {transcription.split('\n').map((line, index) => {
                const match = line.match(/^Speaker (\d+) \[([\d.:]+) - ([\d.:]+)\]: "(.*)"$/);
                if (!match) return null;

                const [, speakerId, startTime, endTime, text] = match;
                const speaker = speakers[parseInt(speakerId) - 1];

                return (
                  <div key={index} className="flex gap-4 items-start p-2 hover:bg-gray-50 rounded">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {speaker?.initial || `S${speakerId}`}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{speaker?.name || `Speaker ${speakerId}`}</span>
                        <span className="text-sm text-gray-500">({startTime})</span>
                      </div>
                      <p className="text-gray-700">{text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Speakers */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Voci individuate ({speakers.length})</h3>
              <button className="text-gray-500 hover:text-gray-700">
                <Edit2 size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {speakers.map((speaker) => (
                <div key={speaker.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold`}>
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

          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Save size={20} />
            Salva modifiche
          </button>
        </div>
      </div>
    </div>
  );
}