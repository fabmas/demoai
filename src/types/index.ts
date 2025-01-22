export interface Recording {
  id: string;
  name: string;
  status: 'processing' | 'completed' | 'failed';
  reviewStatus: 'draft' | 'reviewed';
  date: string;
  duration?: number;
  fileSize?: number;
  language?: string;
  confidence?: number;
}

export interface Speaker {
  id: string;
  name: string;
  initial: string;
}

export interface TranscriptionLine {
  id: string;
  speakerId: string;
  timestamp: string;
  text: string;
  isReviewed: boolean;
  confidence: number;
}

export interface Prompt {
  id: string;
  name: string;
  content: string;
  type: 'full' | 'summary' | 'anonymous' | 'normal';
}