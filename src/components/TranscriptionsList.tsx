import React from 'react';
import { FileText, Trash2, Edit2 } from 'lucide-react';
import type { Recording } from '../types';

interface TranscriptionsListProps {
  recordings: Recording[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function TranscriptionsList({ recordings, onDelete, onEdit }: TranscriptionsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {recordings.map((recording) => (
            <tr key={recording.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <FileText size={20} className="text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">{recording.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(recording.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${recording.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    recording.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {recording.status.charAt(0).toUpperCase() + recording.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${recording.reviewStatus === 'reviewed' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                  {recording.reviewStatus.charAt(0).toUpperCase() + recording.reviewStatus.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(recording.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                    disabled={recording.status !== 'completed'}
                    title={recording.status !== 'completed' ? 'Transcription must be completed to edit' : 'Edit transcription'}
                  >
                    <Edit2 size={18} className={recording.status !== 'completed' ? 'opacity-50' : ''} />
                  </button>
                  <button
                    onClick={() => onDelete(recording.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}