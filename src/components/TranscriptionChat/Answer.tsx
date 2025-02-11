import React from 'react';
import { MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  message: {
    role: 'user' | 'assistant';
    content: string;
    citations?: string[];
    context?: {
      thoughts?: any[];
      data_points?: string[];
    };
  };
  onCitationClick: (citation: string) => void;
}

export function Answer({ message, onCitationClick }: Props) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex gap-4 ${isAssistant ? 'bg-gray-50 p-4 rounded-lg' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isAssistant ? 'bg-blue-500 text-white' : 'bg-gray-200'
      }`}>
        {isAssistant ? (
          <MessageSquare size={16} />
        ) : (
          <div className="w-4 h-4 rounded-full bg-gray-500" />
        )}
      </div>
      <div className="flex-1">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            children={message.content}
            components={{
              a: ({ node, ...props }) => {
                if (props.href?.startsWith('[') && props.href.endsWith(']')) {
                  const citation = props.href.slice(1, -1);
                  return (
                    <button
                      onClick={() => onCitationClick(citation)}
                      className="text-blue-600 hover:text-blue-800 no-underline"
                    >
                      {props.children}
                    </button>
                  );
                }
                return <a {...props} />;
              }
            }}
          />
        </div>
        {message.context?.data_points && (
          <div className="mt-2 text-sm text-gray-500">
            <p className="font-medium">Fonti:</p>
            <ul className="list-disc pl-5 space-y-1">
              {message.context.data_points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}