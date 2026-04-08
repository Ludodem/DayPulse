import { useCallback } from 'react';
import type { StorageData } from '../types';

export function useNotes(
  data: StorageData,
  persist: (data: StorageData) => void,
) {
  const getNote = useCallback(
    (date: string): string => data.notes[date] || '',
    [data.notes],
  );

  const setNote = useCallback(
    (date: string, text: string) => {
      const notes = { ...data.notes };
      if (text.trim()) {
        notes[date] = text;
      } else {
        delete notes[date];
      }
      persist({ ...data, notes });
    },
    [data, persist],
  );

  return { getNote, setNote };
}
