import type { StorageData, Metric, DayScore } from '../types';

const STORAGE_KEY = 'daypulse-data';
const CURRENT_VERSION = 1;

const DEFAULT_METRICS: Metric[] = [
  { id: crypto.randomUUID(), name: 'Energy', emoji: '⚡', order: 0, createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), name: 'Happiness', emoji: '😊', order: 1, createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), name: 'Focus', emoji: '🎯', order: 2, createdAt: new Date().toISOString() },
];

function getDefaultData(): StorageData {
  return { version: CURRENT_VERSION, metrics: DEFAULT_METRICS, scores: [] };
}

export function loadData(): StorageData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const data = getDefaultData();
    saveData(data);
    return data;
  }
  return JSON.parse(raw) as StorageData;
}

export function saveData(data: StorageData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function exportData(): string {
  return localStorage.getItem(STORAGE_KEY) || JSON.stringify(getDefaultData());
}

export function importData(json: string): StorageData {
  const data = JSON.parse(json) as StorageData;
  if (!data.version || !Array.isArray(data.metrics) || !Array.isArray(data.scores)) {
    throw new Error('Invalid DayPulse data format');
  }
  saveData(data);
  return data;
}

// Helpers
export function getScoresForDate(scores: DayScore[], date: string): DayScore[] {
  return scores.filter((s) => s.date === date);
}

export function getAverageForDate(scores: DayScore[], date: string): number | null {
  const dayScores = getScoresForDate(scores, date);
  if (dayScores.length === 0) return null;
  return dayScores.reduce((sum, s) => sum + s.value, 0) / dayScores.length;
}
