import { useCallback } from 'react';
import type { StorageData, DayScore } from '../types';

export function useScores(
  data: StorageData,
  persist: (data: StorageData) => void,
) {
  const setScore = useCallback(
    (date: string, metricId: string, value: number) => {
      const clamped = Math.max(0, Math.min(10, Math.round(value)));
      const now = new Date().toISOString();
      const existing = data.scores.findIndex(
        (s) => s.date === date && s.metricId === metricId,
      );

      let newScores: DayScore[];
      if (existing >= 0) {
        newScores = data.scores.map((s, i) =>
          i === existing ? { ...s, value: clamped, updatedAt: now } : s,
        );
      } else {
        newScores = [
          ...data.scores,
          { date, metricId, value: clamped, updatedAt: now },
        ];
      }

      persist({ ...data, scores: newScores });
    },
    [data, persist],
  );

  const getScore = useCallback(
    (date: string, metricId: string): number | null => {
      const score = data.scores.find(
        (s) => s.date === date && s.metricId === metricId,
      );
      return score ? score.value : null;
    },
    [data.scores],
  );

  return { setScore, getScore };
}
