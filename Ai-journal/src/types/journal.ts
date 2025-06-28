
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood?: string;
  summary?: string;
  aiAnalysis?: {
    mood: string;
    moodScore: number;
    summary: string;
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MoodData {
  mood: string;
  score: number;
  color: string;
  emoji: string;
}
