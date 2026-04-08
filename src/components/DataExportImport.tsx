import { useRef } from 'react';
import { exportData, importData } from '../utils/storage';
import type { StorageData } from '../types';

interface DataExportImportProps {
  onImport: (data: StorageData) => void;
}

export default function DataExportImport({ onImport }: DataExportImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daypulse-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = importData(reader.result as string);
        onImport(data);
      } catch {
        alert('Invalid file format. Please select a valid DayPulse backup.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-lg">Data</h3>
      <div className="flex gap-3">
        <button
          onClick={handleExport}
          className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-emerald-700"
        >
          Export JSON
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600"
        >
          Import JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>
      <p className="text-xs text-slate-400">
        Export saves all your metrics and scores. Import replaces all current data.
      </p>
    </div>
  );
}
