import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, RotateCcw, Plus, X, AlertCircle, Download } from 'lucide-react';
import { CosmosService, Template } from '../services/cosmosService';
import { OpenAIService } from '../services/openaiService';
import ReactMarkdown from 'react-markdown';
import { StorageService } from '../services/storageService';
import { jsPDF } from 'jspdf';

interface InsightGeneratorProps {
  transcriptionId: string;
  transcriptionText: string;
  recordingName: string;
  onClose: () => void;
}

interface Insight {
  id: string;
  name: string;
  prompt: string;
  result: string;
  error?: string;
}

interface TextSegment {
  text: string;
  isBold: boolean;
}

interface ListItem {
  prefix: string;
  segments: TextSegment[];
}

interface ProcessedMarkdownSection {
  text: string;
  level: 'h1' | 'h2' | 'h3' | 'normal';
  isList?: boolean;
  listItems?: ListItem[];
  segments?: TextSegment[];
}

export function InsightGenerator({ transcriptionId, transcriptionText, recordingName, onClose }: InsightGeneratorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [activeInsightId, setActiveInsightId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplateSelect, setShowTemplateSelect] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cosmosService = new CosmosService();
  const openAIService = new OpenAIService();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const loadedTemplates = await cosmosService.getTemplates();
      const templatesWithEmpty = [
        {
          id: 'empty',
          name: '(vuoto)',
          prompt: ''
        },
        ...loadedTemplates
      ];
      setTemplates(templatesWithEmpty);
    } catch (error) {
      console.error('Error loading templates:', error);
      setError('Errore nel caricamento dei template');
    }
  };

  const handleTemplateSelect = async (template: Template) => {
    setShowTemplateSelect(false);
    setError(null);
    
    const newInsight: Insight = {
      id: crypto.randomUUID(),
      name: template.name,
      prompt: template.prompt,
      result: ''
    };

    setInsights(prev => [...prev, newInsight]);
    setActiveInsightId(newInsight.id);
    
    if (template.prompt) {
      await generateInsight(newInsight.id, template.prompt);
    }
  };

  const generateInsight = async (insightId: string, prompt: string) => {
    if (!prompt.trim()) {
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await openAIService.generateInsight(transcriptionText, prompt);
      setInsights(prev => 
        prev.map(insight => 
          insight.id === insightId 
            ? { ...insight, result, error: undefined }
            : insight
        )
      );
    } catch (error) {
      console.error('Error generating insight:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      setInsights(prev => 
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
    setEditingNameId(null);
  };

  const handleNameEdit = (insightId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingNameId(insightId);
    setEditingPromptId(null);
  };

  const handlePromptSave = async (insightId: string, newPrompt: string) => {
    setEditingPromptId(null);
    setInsights(prev => 
      prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, prompt: newPrompt }
          : insight
      )
    );
    await generateInsight(insightId, newPrompt);
  };

  const handleNameSave = (insightId: string, newName: string) => {
    setEditingNameId(null);
    setInsights(prev => 
      prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, name: newName }
          : insight
      )
    );
  };

  const handleInsightDelete = (insightId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setInsights(prev => prev.filter(insight => insight.id !== insightId));
    if (activeInsightId === insightId) {
      setActiveInsightId(null);
    }
  };

  const handleRegenerate = async (insightId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const insight = insights.find(i => i.id === insightId);
    if (insight) {
      await generateInsight(insightId, insight.prompt);
    }
  };

  const handleInsightSelect = (insightId: string) => {
    if (editingNameId === null && editingPromptId === null) {
      setActiveInsightId(insightId);
    }
  };

  const extractBoldSegments = (text: string): TextSegment[] => {
    const segments: TextSegment[] = [];
    let currentIndex = 0;
    
    while (currentIndex < text.length) {
      const boldStart = text.indexOf('**', currentIndex);
      
      if (boldStart === -1) {
        if (currentIndex < text.length) {
          segments.push({
            text: text.slice(currentIndex),
            isBold: false
          });
        }
        break;
      }
      
      if (boldStart > currentIndex) {
        segments.push({
          text: text.slice(currentIndex, boldStart),
          isBold: false
        });
      }
      
      const boldEnd = text.indexOf('**', boldStart + 2);
      if (boldEnd === -1) {
        segments.push({
          text: text.slice(currentIndex),
          isBold: false
        });
        break;
      }
      
      segments.push({
        text: text.slice(boldStart + 2, boldEnd),
        isBold: true
      });
      
      currentIndex = boldEnd + 2;
    }
    
    return segments;
  };

  const processMarkdownForPDF = (markdown: string): ProcessedMarkdownSection[] => {
    const lines = markdown.split('\n');
    const sections: ProcessedMarkdownSection[] = [];
    let currentListItems: ListItem[] = [];
    
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        if (currentListItems.length > 0) {
          sections.push({
            text: '',
            level: 'normal',
            isList: true,
            listItems: currentListItems
          });
          currentListItems = [];
        }
        return;
      }

      // Handle headers with numbers
      if (trimmedLine.startsWith('### ')) {
        if (currentListItems.length > 0) {
          sections.push({
            text: '',
            level: 'normal',
            isList: true,
            listItems: currentListItems
          });
          currentListItems = [];
        }
        sections.push({
          text: trimmedLine.replace(/^### /, ''),
          level: 'h3'
        });
      }
      else if (trimmedLine.startsWith('## ')) {
        if (currentListItems.length > 0) {
          sections.push({
            text: '',
            level: 'normal',
            isList: true,
            listItems: currentListItems
          });
          currentListItems = [];
        }
        sections.push({
          text: trimmedLine.replace(/^## /, ''),
          level: 'h2'
        });
      }
      else if (trimmedLine.startsWith('# ')) {
        if (currentListItems.length > 0) {
          sections.push({
            text: '',
            level: 'normal',
            isList: true,
            listItems: currentListItems
          });
          currentListItems = [];
        }
        sections.push({
          text: trimmedLine.replace(/^# /, ''),
          level: 'h1'
        });
      }
      // Handle bullet lists
      else if (trimmedLine.match(/^[*-] /)) {
        const itemText = trimmedLine.replace(/^[*-] /, '');
        currentListItems.push({
          prefix: '• ',
          segments: extractBoldSegments(itemText)
        });
      }
      // Handle numbered lists
      else if (trimmedLine.match(/^\d+\. /)) {
        const [prefix] = trimmedLine.match(/^\d+\. /) || [''];
        const itemText = trimmedLine.replace(/^\d+\. /, '');
        currentListItems.push({
          prefix,
          segments: extractBoldSegments(itemText)
        });
      }
      // Handle normal text
      else {
        if (currentListItems.length > 0) {
          sections.push({
            text: '',
            level: 'normal',
            isList: true,
            listItems: currentListItems
          });
          currentListItems = [];
        }
        
        sections.push({
          text: trimmedLine,
          level: 'normal',
          segments: extractBoldSegments(trimmedLine)
        });
      }
    });

    // Handle any remaining list items
    if (currentListItems.length > 0) {
      sections.push({
        text: '',
        level: 'normal',
        isList: true,
        listItems: currentListItems
      });
    }

    return sections;
  };

  const handleExportPDF = async () => {
    if (!activeInsight) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    let currentY = margin;

    // Add header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(recordingName, margin, currentY);
    currentY += 10;

    // Add insight name
    doc.setFontSize(14);
    doc.text(activeInsight.name, margin, currentY);
    currentY += 8;

    // Add date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString('it-IT'), margin, currentY);
    currentY += 15;

    // Process and add content
    const sections = processMarkdownForPDF(activeInsight.result);
    
    for (const section of sections) {
      // Check if we need a new page
      if (currentY > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
      }

      switch (section.level) {
        case 'h1':
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(section.text, margin, currentY);
          currentY += 10;
          break;

        case 'h2':
          doc.setFontSize(13);
          doc.setFont('helvetica', 'bold');
          doc.text(section.text, margin, currentY);
          currentY += 8;
          break;

        case 'h3':
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(section.text, margin, currentY);
          currentY += 8;
          break;

        case 'normal':
          doc.setFontSize(11);
          
          if (section.isList && section.listItems) {
            section.listItems.forEach(item => {
              if (currentY > pageHeight - margin) {
                doc.addPage();
                currentY = margin;
              }
              
              let xPos = margin;
              const baseY = currentY;
              
              // Draw the list item prefix (bullet or number)
              doc.setFont('helvetica', 'normal');
              doc.text(item.prefix, xPos, baseY);
              xPos += doc.getTextWidth(item.prefix) + 2;
              
              // Process each segment with its formatting
              item.segments.forEach(segment => {
                const segmentWidth = doc.getTextWidth(segment.text);
                if (xPos + segmentWidth > pageWidth - margin) {
                  currentY += 6;
                  xPos = margin + 10; // Indent continuation lines
                }
                doc.setFont('helvetica', segment.isBold ? 'bold' : 'normal');
                doc.text(segment.text, xPos, currentY);
                xPos += segmentWidth + 1;
              });
              
              currentY += 6;
            });
            currentY += 2; // Add extra space after list
          } else if (section.segments) {
            let xPos = margin;
            section.segments.forEach(segment => {
              const segmentWidth = doc.getTextWidth(segment.text);
              if (xPos + segmentWidth > pageWidth - margin) {
                currentY += 6;
                xPos = margin;
              }
              doc.setFont('helvetica', segment.isBold ? 'bold' : 'normal');
              doc.text(segment.text, xPos, currentY);
              xPos += segmentWidth + 1;
            });
            currentY += 6;
          } else if (section.text) {
            doc.setFont('helvetica', 'normal');
            doc.text(section.text, margin, currentY);
            currentY += 6;
          }
          break;
      }
    }

    // Save the PDF
    doc.save(`${recordingName} - ${activeInsight.name}.pdf`);
  };

  const activeInsight = insights.find(i => i.id === activeInsightId);

  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">{recordingName}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 p-6">
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
                <div className="max-h-[200px] overflow-y-auto space-y-2">
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

          <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2">
            {insights.map(insight => (
              <div
                key={insight.id}
                onClick={() => handleInsightSelect(insight.id)}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center justify-between cursor-pointer
                  ${activeInsightId === insight.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  ${insight.error ? 'bg-red-50' : ''}`}
              >
                {editingNameId === insight.id ? (
                  <input
                    type="text"
                    value={insight.name}
                    onChange={(e) => setInsights(prev => 
                      prev.map(i => 
                        i.id === insight.id 
                          ? { ...i, name: e.target.value }
                          : i
                      )
                    )}
                    onBlur={() => handleNameSave(insight.id, insight.name)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleNameSave(insight.id, insight.name);
                      }
                    }}
                    className="flex-1 px-2 py-1 border rounded text-sm mr-2"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span>{insight.name}</span>
                )}
                <div className="flex items-center gap-2">
                  <div
                    onClick={(e) => handleNameEdit(insight.id, e)}
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

        <div className="col-span-3 space-y-6">
          {activeInsight && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Prompt</h3>
                  <div
                    onClick={(e) => handlePromptEdit(activeInsight.id, e)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <Edit2 size={16} />
                  </div>
                </div>
                {editingPromptId === activeInsight.id ? (
                  <textarea
                    value={activeInsight.prompt}
                    onChange={(e) => setInsights(prev => 
                      prev.map(i => 
                        i.id === activeInsight.id 
                          ? { ...i, prompt: e.target.value }
                          : i
                      )
                    )}
                    onBlur={() => handlePromptSave(activeInsight.id, activeInsight.prompt)}
                    className="w-full p-2 border rounded-lg"
                    rows={4}
                    placeholder="Inserisci il tuo prompt personalizzato..."
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {activeInsight.prompt || "Nessun prompt inserito. Clicca sull'icona della matita per aggiungere un prompt."}
                  </p>
                )}
              </div>

              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Insight elaborato</h3>
                  <div className="flex items-center gap-2">
                    {activeInsight.prompt && (
                      <button
                        onClick={(e) => handleRegenerate(activeInsight.id, e)}
                        className={`flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg ${
                          isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Rigenera insight"
                      >
                        <RotateCcw size={16} />
                        <span>Rigenera</span>
                      </button>
                    )}
                    {activeInsight.result && (
                      <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Esporta in PDF"
                      >
                        <Download size={16} />
                        <span>Esporta PDF</span>
                      </button>
                    )}
                  </div>
                </div>
                
                {activeInsight.error ? (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                    <AlertCircle size={20} />
                    <span>{activeInsight.error}</span>
                  </div>
                ) : isGenerating ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : !activeInsight.prompt ? (
                  <div className="text-gray-500 text-center py-8">
                    Inserisci un prompt per generare l'insight
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
                      {activeInsight.result}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}