import { useState, useCallback } from 'react';
import type { Metric, StorageData } from '../types';
import { loadData, saveData } from '../utils/storage';

export function useMetrics() {
  const [data, setData] = useState<StorageData>(loadData);

  const persist = useCallback((updated: StorageData) => {
    saveData(updated);
    setData(updated);
  }, []);

  const addMetric = useCallback((name: string, emoji?: string) => {
    setData((prev) => {
      const metric: Metric = {
        id: crypto.randomUUID(),
        name,
        emoji,
        order: prev.metrics.length,
        createdAt: new Date().toISOString(),
      };
      const updated = { ...prev, metrics: [...prev.metrics, metric] };
      saveData(updated);
      return updated;
    });
  }, []);

  const updateMetric = useCallback((id: string, changes: Partial<Pick<Metric, 'name' | 'emoji'>>) => {
    setData((prev) => {
      const updated = {
        ...prev,
        metrics: prev.metrics.map((m) => (m.id === id ? { ...m, ...changes } : m)),
      };
      saveData(updated);
      return updated;
    });
  }, []);

  const deleteMetric = useCallback((id: string) => {
    setData((prev) => {
      const updated = {
        ...prev,
        metrics: prev.metrics.filter((m) => m.id !== id),
        scores: prev.scores.filter((s) => s.metricId !== id),
      };
      saveData(updated);
      return updated;
    });
  }, []);

  const reorderMetrics = useCallback((metrics: Metric[]) => {
    setData((prev) => {
      const updated = { ...prev, metrics };
      saveData(updated);
      return updated;
    });
  }, []);

  return {
    data,
    metrics: data.metrics,
    scores: data.scores,
    addMetric,
    updateMetric,
    deleteMetric,
    reorderMetrics,
    persist,
  };
}
