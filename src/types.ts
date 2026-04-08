export interface Metric {
  id: string;
  name: string;
  emoji?: string;
  order: number;
  createdAt: string;
}

export interface DayScore {
  date: string; // "YYYY-MM-DD"
  metricId: string;
  value: number; // 0-10
  updatedAt: string;
}

export interface StorageData {
  version: number;
  metrics: Metric[];
  scores: DayScore[];
  notes: Record<string, string>; // date -> free text
}
