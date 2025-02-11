import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, X, AlertCircle, ChevronRight } from 'lucide-react';
import { RAGService } from '../../services/RAGService';
import { TranscriptionData } from '../../services/storageService';
import { AzureStorageService } from '../../services/azureStorage';
import { Answer } from './Answer';
import { CitationPanel } from './CitationPanel';

interface Props {
  selectedTranscriptions: TranscriptionData[];
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  context?: {
    thoughts?: any[];
    data_points?: string[];
  };
}

export function TranscriptionChat({ selectedTranscriptions, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCitation, setActiveCitation] = useState<string | null>(null);
  const [showCitations, setShowCitations] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexingProgress, setIndexingProgress] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ragService = useRef(new RAGService());
  const azureStorage = useRef(new AzureStorageService());

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const indexTranscriptions = async () => {
      if (selectedTranscriptions.length === 0) return;

      try {
        setIsIndexing(true);
        setIndexingProgress(0);

        // Initialize RAG service
        await ragService.current.initialize();

        // Process each transcription
        for (let i = 0; i < selectedTranscriptions.length; i++) {
          const transcription = selectedTranscriptions[i];
          
          if (!transcription.URL_TranscriptionTXT) {
            console.warn(`No TXT URL for transcription: ${transcription.id}`);
            continue;
          }

          try {
            // Extract blob name from URL
            const blobName = transcription.URL_TranscriptionTXT.split('/').pop();
            if (!blobName) {
              console.warn(`Invalid TXT URL for transcription: ${transcription.id}`);
              continue;
            }

            // Download TXT content
            const txtBlob = await azureStorage.current.downloadBlob(blobName);
            const txtContent = await txtBlob.text();

            // Index the content
            await ragService.current.indexTranscription(
              transcription.id,
              transcription.name,
              txtContent
            );

            // Update progress
            setIndexingProgress(((i + 1) / selectedTranscriptions.length) * 100);
          } catch (error) {
            console.error(`Error processing transcription ${transcription.id}:`, error);
          }
        }
      } catch (error) {
        console.error('Error indexing transcriptions:', error);
        setError('Error preparing chat data. Please try again.');
      } finally {
        setIsIndexing(false);
      }
    };

    indexTranscriptions();
  }, [selectedTranscriptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || isIndexing) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setError(null);
    setIsLoading(true);

    try {
      // Add user message immediately
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

      // Get response from RAG service
      const response = await ragService.current.getAnswer(userMessage, messages);

      // Add assistant message with citations
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.message.content,
        citations: response.citations,
        context: response.context
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while getting the answer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Chat con le trascrizioni</h2>
            <p className="text-sm text-gray-600">
              {selectedTranscriptions.length} trascrizioni selezionate
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {/* Indexing progress */}
            {isIndexing && (
              <div className="p-4 bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">
                    Preparazione chat in corso...
                  </span>
                  <span className="text-sm text-blue-700">
                    {Math.round(indexingProgress)}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${indexingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <Answer
                  key={index}
                  message={message}
                  onCitationClick={citation => {
                    setActiveCitation(citation);
                    setShowCitations(true);
                  }}
                />
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200" />
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Fai una domanda sulle trascrizioni..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading || isIndexing}
                  />
                  <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading || isIndexing}
                  className={`p-2 rounded-lg ${
                    !inputValue.trim() || isLoading || isIndexing
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  title="Send"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Citations panel */}
          <div className={`border-l w-96 transition-all duration-300 ${showCitations ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Citazioni</h3>
                <button
                  onClick={() => setShowCitations(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {activeCitation && (
                  <CitationPanel citation={activeCitation} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}