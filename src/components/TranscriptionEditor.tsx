import React, { useState, useEffect, useRef } from 'react';
import { Edit2, X, Search, Save, AlertCircle, Play, Pause, RefreshCw } from 'lucide-react';
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
    speaker: number | string;
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioFileSize, setAudioFileSize] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState('');
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [editingPhraseIndex, setEditingPhraseIndex] = useState<number | null>(null);
  const initialTitle = useRef(title);
  const initialSpeakers = useRef<Speaker[]>([]);
  const initialReviewedStatus = useRef(isReviewed);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const storageService = new StorageService();
  const azureStorage = new AzureStorageService();

  useEffect(() => {
    setTitle(fileName.replace(/\.[^/.]+$/, ""));
  }, [fileName]);

  useEffect(() => {
    loadTranscriptionData();
  }, [jsonUrl, transcriptionId]);

  useEffect(() => {
    setIsReviewed(initialReviewStatus);
  }, [initialReviewStatus]);

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Store initial values after data is loaded
    initialTitle.current = title;
    initialSpeakers.current = [...speakers];
    initialReviewedStatus.current = isReviewed;
  }, [transcriptionJson]); // Only update initial values after data is loaded

  useEffect(() => {
    const titleChanged = title !== initialTitle.current;
    const speakersChanged = JSON.stringify(speakers) !== JSON.stringify(initialSpeakers.current);
    const reviewStatusChanged = isReviewed !== initialReviewedStatus.current;
    
    setHasUnsavedChanges(titleChanged || speakersChanged || reviewStatusChanged);
  }, [title, speakers, isReviewed]);

  const formatSpeakerName = (speaker: number | string): { name: string; initial: string } => {
    if (typeof speaker === 'number') {
      return {
        name: `Speaker ${speaker}`,
        initial: `S${speaker}`
      };
    } else {
      return {
        name: speaker,
        initial: speaker.split(' ').map(word => word[0]).join('')
      };
    }
  };

  const loadTranscriptionData = async (retryCount = 0) => {
    if (!transcriptionId || !jsonUrl) {
      setError('ID trascrizione o URL JSON mancante');
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      // Extract blob name from URL with better error handling
      const blobName = jsonUrl.split('/').pop();
      if (!blobName) {
        throw new Error('URL JSON non valido');
      }

      // Load transcription data with retry mechanism
      let currentTranscription;
      try {
        const transcriptions = await storageService.loadTranscriptions();
        currentTranscription = transcriptions[transcriptionId];
        
        if (!currentTranscription) {
          throw new Error('Trascrizione non trovata nel database');
        }

        // Get audio file metadata
        if (currentTranscription.URL_TranscriptionAudio) {
          try {
            const audioBlob = await azureStorage.downloadBlob(
              currentTranscription.URL_TranscriptionAudio.split('/').pop()!
            );
            
            // Create audio element to get duration
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            // Get file size from blob
            setAudioFileSize(audioBlob.size);
            
            // Wait for metadata to load to get duration
            await new Promise((resolve, reject) => {
              audio.addEventListener('loadedmetadata', () => {
                setAudioDuration(Math.round(audio.duration));
                resolve(null);
              });
              audio.addEventListener('error', (e) => reject(e));
            });

            // Set up audio player
            if (audioRef.current) {
              audioRef.current.src = audioUrl;
            } else {
              audioRef.current = audio;
              audioRef.current.addEventListener('ended', () => {
                setCurrentlyPlaying(null);
              });
            }
          } catch (audioError) {
            console.error('Error loading audio metadata:', audioError);
            // Fallback to stored values if metadata loading fails
            setAudioDuration(currentTranscription.duration || 0);
            setAudioFileSize(currentTranscription.fileSize || 0);
          }
        }

        // Set last update time
        setLastUpdateTime(currentTranscription.date);

      } catch (error) {
        console.error('Database error:', error);
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return loadTranscriptionData(retryCount + 1);
        }
        throw new Error('Errore nel caricamento dei dati dal database');
      }

      // Load JSON data with retry mechanism
      let jsonData: TranscriptionJson;
      try {
        const jsonBlob = await azureStorage.downloadBlob(blobName);
        const jsonText = await jsonBlob.text();
        jsonData = JSON.parse(jsonText);
        
        if (!jsonData.phrases || !Array.isArray(jsonData.phrases)) {
          throw new Error('Formato JSON non valido');
        }
      } catch (error) {
        console.error('Download error:', error);
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return loadTranscriptionData(retryCount + 1);
        }
        throw new Error(`Errore nel download del file: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
      }

      setTranscriptionJson(jsonData);

      // Initialize speakers list
      let speakersList: Speaker[] = [];

      // First try to use speakers from CosmosDB
      if (currentTranscription.Speakers?.length > 0) {
        const jsonSpeakerIds = new Set(jsonData.phrases.map(p => p.speaker.toString()));
        const existingSpeakers = currentTranscription.Speakers;
        
        speakersList = Array.from(jsonSpeakerIds).map((speakerId, index) => {
          const existingName = existingSpeakers[index];
          return {
            id: speakerId,
            name: existingName || `Speaker ${speakerId}`,
            initial: existingName ? existingName.split(' ').map(word => word[0]).join('') : `S${speakerId}`
          };
        });
      } else {
        // Fall back to JSON file analysis if no speakers in CosmosDB
        const seenSpeakers = new Set<string>();
        speakersList = jsonData.phrases
          .map(p => p.speaker)
          .filter(speaker => {
            const speakerId = speaker.toString();
            if (!seenSpeakers.has(speakerId)) {
              seenSpeakers.add(speakerId);
              return true;
            }
            return false;
          })
          .map(speaker => ({
            id: speaker.toString(),
            ...formatSpeakerName(speaker)
          }));
      }

      setSpeakers(speakersList);
      initialSpeakers.current = [...speakersList]; // Set initial speakers after loading

      // Initialize audio player with retry mechanism
      if (currentTranscription.URL_TranscriptionAudio) {
        try {
          const audioBlob = await azureStorage.downloadBlob(
            currentTranscription.URL_TranscriptionAudio.split('/').pop()!
          );
          const audioUrl = URL.createObjectURL(audioBlob);
          
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
          } else {
            audioRef.current = new Audio(audioUrl);
            audioRef.current.addEventListener('ended', () => {
              setCurrentlyPlaying(null);
            });
          }
        } catch (audioError) {
          console.error('Audio loading error:', audioError);
          // Don't throw here, just log the error as audio is not critical
          console.warn('Audio playback will not be available');
        }
      }

    } catch (error) {
      console.error('Error loading transcription data:', error);
      setError(error instanceof Error ? error.message : 'Errore sconosciuto');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPhrases = React.useMemo(() => {
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

  const formatTimestamp = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleSpeakerNameChange = (id: string, newName: string) => {
    setSpeakers(speakers.map(speaker => 
      speaker.id === id 
        ? { ...speaker, name: newName, initial: newName.split(' ').map(n => n[0]).join('') }
        : speaker
    ));
  };

  const getSpeakerColorIndex = (speakerId: string): number => {
    return speakers.findIndex(s => s.id === speakerId);
  };

  const handlePlayPhrase = async (phraseId: string, offset: number, duration: number) => {
    if (!audioRef.current) return;

    if (currentlyPlaying === phraseId) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    } else {
      if (currentlyPlaying) {
        audioRef.current.pause();
      }
      audioRef.current.currentTime = offset / 1000;
      try {
        await audioRef.current.play();
        setCurrentlyPlaying(phraseId);
        // Stop after the phrase duration
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            setCurrentlyPlaying(null);
          }
        }, duration);
      } catch (error) {
        console.error('Error playing audio:', error);
        setError('Errore nella riproduzione dell\'audio');
      }
    }
  };

  const handlePhraseEdit = (index: number) => {
    setEditingPhraseIndex(index);
    // Focus the textarea after it's rendered
    setTimeout(() => {
      if (editTextareaRef.current) {
        editTextareaRef.current.focus();
      }
    }, 0);
  };

  const handlePhraseSave = (index: number, newText: string) => {
    if (!transcriptionJson) return;

    const updatedPhrases = [...transcriptionJson.phrases];
    updatedPhrases[index] = {
      ...updatedPhrases[index],
      text: newText.trim()
    };

    // Update transcriptionJson with new phrases
    setTranscriptionJson({
      ...transcriptionJson,
      phrases: updatedPhrases,
      transcriptionText: updatedPhrases
        .map(phrase => `Speaker ${phrase.speaker} [${formatTimestamp(phrase.offsetMilliseconds)} - ${formatTimestamp(phrase.offsetMilliseconds + phrase.durationMilliseconds)}]: "${phrase.text}"`)
        .join('\n')
    });

    setEditingPhraseIndex(null);
    setHasUnsavedChanges(true);
  };

  const handlePhraseEditCancel = () => {
    setEditingPhraseIndex(null);
  };

  const handleSave = async () => {
    if (!transcriptionId) {
      setError('ID trascrizione mancante');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      if (transcriptionJson) {
        const updatedJson = {
          ...transcriptionJson,
          speakers: speakers.map(s => ({ id: s.id, name: s.name }))
        };

        const blobName = jsonUrl.split('/').pop();
        if (!blobName) {
          throw new Error('URL JSON non valido');
        }

        const jsonBlob = new Blob([JSON.stringify(updatedJson, null, 2)], { type: 'application/json' });
        const jsonFile = new File([jsonBlob], blobName, { type: 'application/json' });
        await azureStorage.uploadFile(jsonFile);

        await storageService.updateTranscription(transcriptionId, {
          id: transcriptionId,
          name: title,
          date: lastUpdateTime,
          status: 'completed',
          reviewStatus: isReviewed ? 'reviewed' : 'draft',
          language: language,
          confidence: confidence,
          duration: audioDuration,
          fileSize: audioFileSize,
          URL_TranscriptionAudio: '',
          URL_TranscriptionTXT: '',
          URL_TranscriptionJSON: jsonUrl,
          Speakers: speakers.map(s => s.name),
          custom_prompts: []
        });

        // Update initial values after successful save
        initialTitle.current = title;
        initialSpeakers.current = [...speakers];
        initialReviewedStatus.current = isReviewed;
        setHasUnsavedChanges(false);

        onClose();
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      setError(error instanceof Error ? error.message : 'Errore nel salvataggio delle modifiche');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedChangesModal(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowUnsavedChangesModal(false);
    onClose();
  };

  const handleCancelClose = () => {
    setShowUnsavedChangesModal(false);
  };

  if (isLoading) {
    return (
      <div className="mt-6 bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3">Caricamento trascrizione...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={24} />
            <span className="text-lg">{error}</span>
          </div>
          <button
            onClick={() => loadTranscriptionData()}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <RefreshCw size={20} />
            Riprova
          </button>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            Chiudi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <div className="flex items-center gap-4">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold px-2 py-1 border rounded w-[500px]"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2 flex-grow">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button 
                onClick={() => setIsEditing(true)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 p-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Informazioni file</h3>
            <div className="space-y-2 text-sm">
              <p>File: {fileName}</p>
              <p>Dimensione: {formatFileSize(audioFileSize || fileSize)}</p>
              <p>Durata audio: {formatDuration(audioDuration || duration)}</p>
              <p>Ultimo aggiornamento: {new Date(lastUpdateTime || lastUpdate).toLocaleString()}</p>
              <p>Lingua: {language} (Confidence: {(confidence * 100).toFixed(0)}%)</p>
            </div>
          </div>

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

          <div className="h-[400px] overflow-y-auto border rounded-lg bg-white">
            <div className="space-y-4 p-4">
              {filteredPhrases.map((phrase, index) => {
                const speaker = speakers.find(s => s.id === phrase.speaker.toString());
                const colorIndex = speaker ? getSpeakerColorIndex(speaker.id) : index;
                const phraseId = `phrase-${index}`;
                const isPlaying = currentlyPlaying === phraseId;
                const isEditingThisPhrase = editingPhraseIndex === index;

                return (
                  <div key={index} className="flex gap-4 items-start p-2 hover:bg-gray-50 rounded">
                    <div className={`w-10 h-10 rounded-full ${speakerColors[colorIndex % speakerColors.length]} flex items-center justify-center text-white font-semibold`}>
                      {speaker?.initial || (typeof phrase.speaker === 'number' ? `S${phrase.speaker}` : phrase.speaker[0])}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {speaker?.name || (typeof phrase.speaker === 'number' ? `Speaker ${phrase.speaker}` : phrase.speaker)}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({formatTimestamp(phrase.offsetMilliseconds)})
                        </span>
                        <button
                          onClick={() => handlePlayPhrase(phraseId, phrase.offsetMilliseconds, phrase.durationMilliseconds)}
                          className={`p-1 rounded-full hover:bg-gray-200 ${isPlaying ? 'bg-gray-200' : ''}`}
                          title={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button
                          onClick={() => handlePhraseEdit(index)}
                          className="p-1 rounded-full hover:bg-gray-200"
                          title="Modifica frase"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                      {isEditingThisPhrase ? (
                        <div className="space-y-2">
                          <textarea
                            ref={editTextareaRef}
                            defaultValue={phrase.text}
                            className="w-full p-2 border rounded-lg min-h-[60px]"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.ctrlKey) {
                                handlePhraseSave(index, e.currentTarget.value);
                              } else if (e.key === 'Escape') {
                                handlePhraseEditCancel();
                              }
                            }}
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handlePhraseEditCancel()}
                              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                            >
                              Annulla
                            </button>
                            <button
                              onClick={() => handlePhraseSave(index, editTextareaRef.current?.value || '')}
                              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Salva
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">
                            Premi Ctrl + Enter per salvare o Esc per annullare
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-700">{phrase.text}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

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
        </div>
      </div>

      {showUnsavedChangesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Modifiche non salvate</h3>
            <p className="text-gray-600 mb-6">
              Ci sono modifiche non salvate. Sei sicuro di voler chiudere senza salvare?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annulla
              </button>
              <button
                onClick={handleConfirmClose}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Chiudi senza salvare
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-sm text-orange-600">
              * Modifiche non salvate
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              hasUnsavedChanges 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save size={20} />
            {isSaving ? 'Salvataggio...' : 'Salva modifiche'}
          </button>
          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <X size={20} />
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}