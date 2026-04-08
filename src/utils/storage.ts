import type { StorageData, Metric, DayScore } from '../types';

const STORAGE_KEY = 'daypulse-data';
const CURRENT_VERSION = 2;

const DEFAULT_METRICS: Metric[] = [
  { id: crypto.randomUUID(), name: 'Energy', emoji: '⚡', order: 0, createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), name: 'Happiness', emoji: '😊', order: 1, createdAt: new Date().toISOString() },
  { id: crypto.randomUUID(), name: 'Focus', emoji: '🎯', order: 2, createdAt: new Date().toISOString() },
];

function getDefaultData(): StorageData {
  return { version: CURRENT_VERSION, metrics: DEFAULT_METRICS, scores: [], notes: {} };
}

// Each migration transforms data from version N to N+1.
// Add new migrations here when changing the schema.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const migrations: Record<number, (data: any) => any> = {
  1: (data) => {
    // v1 -> v2: add notes field
    data.notes = data.notes ?? {};
    data.version = 2;
    return data;
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrate(data: any): StorageData {
  let current = data;
  while (current.version < CURRENT_VERSION) {
    const migrateFn = migrations[current.version];
    if (!migrateFn) {
      console.warn(`No migration found for version ${current.version}, resetting data`);
      return getDefaultData();
    }
    current = migrateFn(current);
  }
  return current as StorageData;
}

export function loadData(): StorageData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const data = getDefaultData();
    saveData(data);
    return data;
  }
  const parsed = JSON.parse(raw);
  if (!parsed.version) {
    const data = getDefaultData();
    saveData(data);
    return data;
  }
  if (parsed.version < CURRENT_VERSION) {
    const migrated = migrate(parsed);
    saveData(migrated);
    return migrated;
  }
  return parsed as StorageData;
}

export function saveData(data: StorageData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function exportData(): string {
  return localStorage.getItem(STORAGE_KEY) || JSON.stringify(getDefaultData());
}

export function importData(json: string): StorageData {
  const parsed = JSON.parse(json);
  if (!parsed.version || !Array.isArray(parsed.metrics) || !Array.isArray(parsed.scores)) {
    throw new Error('Invalid DayPulse data format');
  }
  const data = parsed.version < CURRENT_VERSION ? migrate(parsed) : parsed as StorageData;
  saveData(data);
  return data;
}

export function resetData(): StorageData {
  localStorage.removeItem(STORAGE_KEY);
  const data = getDefaultData();
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
