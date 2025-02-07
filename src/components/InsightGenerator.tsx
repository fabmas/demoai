import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, RotateCcw, Plus, X, AlertCircle } from 'lucide-react';
import { CosmosService, Template } from '../services/cosmosService';
import { OpenAIService } from '../services/openaiService';
import ReactMarkdown from 'react-markdown';

interface InsightGeneratorProps {
  transcriptionId: string;
  transcriptionText: string;
  onClose: () => void;
}

export function InsightGenerator({ transcriptionId, transcriptionText, onClose }: InsightGeneratorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedInsights, setSelectedInsights] = useState<{
    id: string;
    name: string;
    prompt: string;
    result: string;
    error?: string;
  }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplateSelect, setShowTemplateSelect] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cosmosService = new CosmosService();
  const openAIService = new OpenAIService();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const loadedTemplates = await cosmosService.getTemplates();
      setTemplates(loadedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      setError('Errore nel caricamento dei template');
    }
  };

  const handleTemplateSelect = async (template: Template) => {
    setShowTemplateSelect(false);
    setError(null);
    
    const newInsight = {
      id: crypto.randomUUID(),
      name: template.name,
      prompt: template.prompt,
      result: ''
    };

    setSelectedInsights(prev => [...prev, newInsight]);
    await generateInsight(newInsight.id, template.prompt);
  };

  const generateInsight = async (insightId: string, prompt: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await openAIService.generateInsight(transcriptionText, prompt);
      setSelectedInsights(prev => 
        prev.map(insight => 
          insight.id === insightId 
            ? { ...insight, result, error: undefined }
            : insight
        )
      );
    } catch (error) {
      console.error('Error generating insight:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      setSelectedInsights(prev => 
        prev.map(insight => 
          insight.id === insightId 
            ? { ...insight, error: errorMessage }
            : insight
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePromptEdit = (insightId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingPromptId(insightId);
  };

  const handlePromptSave = async (insightId: string, newPrompt: string) => {
    setEditingPromptId(null);
    setSelectedInsights(prev => 
      prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, prompt: newPrompt }
          : insight
      )
    );
    await generateInsight(insightId, newPrompt);
  };

  const handleInsightDelete = (insightId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedInsights(prev => prev.filter(insight => insight.id !== insightId));
  };

  const handleRegenerate = async (insightId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const insight = selectedInsights.find(i => i.id === insightId);
    if (insight) {
      await generateInsight(insightId, insight.prompt);
    }
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">Insight personalizzati</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-4 gap-6 p-6">
        {/* Left Sidebar - Insights List */}
        <div className="space-y-4">
          <div
            onClick={() => setShowTemplateSelect(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg w-full cursor-pointer"
          >
            <Plus size={20} />
            <span>Nuovo insight</span>
          </div>

          {error && (
            <div className="px-4 py-2 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {showTemplateSelect && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">Aggiungi un insight personalizzato</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Aggiungi un insight personalizzato a partire da uno dei template disponibili.
                </p>
                <div className="space-y-2">
                  {templates.map(template => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      {template.name}
                    </div>
                  ))}
                </div>
                <div
                  onClick={() => setShowTemplateSelect(false)}
                  className="mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer text-center"
                >
                  Annulla
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {selectedInsights.map(insight => (
              <div
                key={insight.id}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between ${
                  insight.error ? 'bg-red-50' : ''
                }`}
              >
                <span>{insight.name}</span>
                <div className="flex items-center gap-2">
                  <div
                    onClick={(e) => handlePromptEdit(insight.id, e)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <Edit2 size={16} />
                  </div>
                  <div
                    onClick={(e) => handleInsightDelete(insight.id, e)}
                    className="text-gray-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-3 space-y-6">
          {selectedInsights.map(insight => (
            <div key={insight.id} className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Prompt</h3>
                {editingPromptId === insight.id ? (
                  <textarea
                    value={insight.prompt}
                    onChange={(e) => setSelectedInsights(prev => 
                      prev.map(i => 
                        i.id === insight.id 
                          ? { ...i, prompt: e.target.value }
                          : i
                      )
                    )}
                    onBlur={() => handlePromptSave(insight.id, insight.prompt)}
                    className="w-full p-2 border rounded-lg"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{insight.prompt}</p>
                )}
              </div>

              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Insight elaborato</h3>
                  <div
                    onClick={(e) => handleRegenerate(insight.id, e)}
                    className={`flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer ${
                      isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <RotateCcw size={16} />
                    <span>Rigenera</span>
                  </div>
                </div>
                
                {insight.error ? (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                    <AlertCircle size={20} />
                    <span>{insight.error}</span>
                  </div>
                ) : isGenerating ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        blockquote: ({node, ...props}) => (
                          <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
                        ),
                        code: ({node, inline, ...props}) => 
                          inline ? (
                            <code className="bg-gray-100 rounded px-1" {...props} />
                          ) : (
                            <code className="block bg-gray-100 rounded p-4 my-4 whitespace-pre-wrap" {...props} />
                          ),
                        strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                        em: ({node, ...props}) => <em className="italic" {...props} />,
                      }}
                    >
                      {insight.result}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}