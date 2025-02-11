import React from 'react';
import { FileText } from 'lucide-react';

interface Props {
  citation: string;
}

export function CitationPanel({ citation }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-600">
        <FileText size={20} />
        <span className="font-medium">{citation}</span>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700 whitespace-pre-wrap">
          {citation}
        </p>
      </div>
    </div>
  );
}