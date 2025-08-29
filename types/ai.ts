export interface ReasoningRequest {
  question: string;
  context?: string;
  examType?: 'UPSC' | 'SSC' | 'Banking' | 'Railway' | 'Defense' | 'General';
}

export interface ReasoningResponse {
  reasoning: string;
  concepts: string[];
  relatedTopics: string[];
  difficulty: number;
  memoryTechniques: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  rawResponse?: string;
}

export interface SpacedRepetitionData {
  nextReview: Date | null;
  difficulty: number;
  repetitionCount: number;
}

export interface StudySession {
  id?: string;
  userId: string;
  examType: string;
  questionsAttempted: number;
  questionsCorrect: number;
  sessionDurationMinutes: number;
  aiAnalysesUsed: number;
  startedAt: Date;
  endedAt?: Date;
}