import React, { useState, useMemo } from 'react';
import { FileText, Trash2, Edit2, Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import type { Recording } from '../types';

interface TranscriptionsListProps {
  recordings: Recording[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onGenerateInsight: (id: string, name: string) => void;
  selectedTranscriptionId?: string;
}

type SortField = 'name' | 'date' | 'status' | 'reviewStatus';
type SortDirection = 'asc' | 'desc';

export function TranscriptionsList({ recordings, onDelete, onEdit, onGenerateInsight, selectedTranscriptionId }: TranscriptionsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter and sort recordings
  const sortedAndFilteredRecordings = useMemo(() => {
    let result = [...recordings];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(recording => 
        recording.name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'reviewStatus':
          comparison = a.reviewStatus.localeCompare(b.reviewStatus);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [recordings, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const SortableHeader = ({ field, children }: { field: SortField, children: React.ReactNode }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <SortIcon field={field} />
      </div>
    </th>
  );

  const getStatusTranslation = (status: string) => {
    switch (status) {
      case 'completed': return 'Completato';
      case 'processing': return 'In elaborazione';
      case 'failed': return 'Fallito';
      case 'reviewed': return 'Revisionato';
      case 'draft': return 'Bozza';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Cerca trascrizione..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <Search 
          size={20} 
          className="absolute left-3 top-2.5 text-gray-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Results count when filtering */}
      {searchQuery && (
        <div className="text-sm text-gray-600">
          {sortedAndFilteredRecordings.length} risultat{sortedAndFilteredRecordings.length === 1 ? 'o' : 'i'} trovat{sortedAndFilteredRecordings.length === 1 ? 'o' : 'i'}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg shadow-md">
        <div className="max-h-[396px] overflow-y-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b">
                <SortableHeader field="name">Nome</SortableHeader>
                <SortableHeader field="date">Data</SortableHeader>
                <SortableHeader field="status">Stato</SortableHeader>
                <SortableHeader field="reviewStatus">Stato Revisione</SortableHeader>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedAndFilteredRecordings.map((recording) => (
                <tr 
                  key={recording.id} 
                  className={`hover:bg-gray-50 ${selectedTranscriptionId === recording.id ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText size={20} className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{recording.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(recording.date).toLocaleDateString('it-IT')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${recording.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        recording.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {getStatusTranslation(recording.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${recording.reviewStatus === 'reviewed' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {getStatusTranslation(recording.reviewStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(recording.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        disabled={recording.status !== 'completed'}
                        title={recording.status !== 'completed' ? 'La trascrizione deve essere completata per modificarla' : 'Modifica trascrizione'}
                      >
                        <Edit2 size={18} className={recording.status !== 'completed' ? 'opacity-50' : ''} />
                      </button>
                      <button
                        onClick={() => onGenerateInsight(recording.id, recording.name)}
                        className="text-purple-600 hover:text-purple-900"
                        disabled={recording.status !== 'completed'}
                        title={recording.status !== 'completed' ? 'La trascrizione deve essere completata per generare insight' : 'Genera insight'}
                      >
                        <Search size={18} className={recording.status !== 'completed' ? 'opacity-50' : ''} />
                      </button>
                      <button
                        onClick={() => onDelete(recording.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Elimina trascrizione"
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
      </div>
    </div>
  );
}