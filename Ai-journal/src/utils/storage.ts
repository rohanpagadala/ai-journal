import { JournalEntry } from '@/types/journal';

const STORAGE_KEY = 'daily-journal-entries';
const API_KEY_STORAGE = 'gemini-api-key';

export const saveEntries = (entries: JournalEntry[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const loadEntries = (): JournalEntry[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const entries = JSON.parse(stored);
    return entries.map((entry: any) => ({
      ...entry,
      date: new Date(entry.date),
      createdAt: new Date(entry.createdAt),
      updatedAt: new Date(entry.updatedAt),
    }));
  } catch (error) {
    console.error('Error parsing stored entries:', error);
    return [];
  }
};

export const saveApiKey = (apiKey: string): void => {
  localStorage.setItem(API_KEY_STORAGE, apiKey);
};

export const loadApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE);
};

export const clearApiKey = (): void => {
  localStorage.removeItem(API_KEY_STORAGE);
};
