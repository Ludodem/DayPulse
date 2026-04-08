import { useState } from 'react';
import type { Metric, StorageData } from '../types';
import MetricManager from '../components/MetricManager';
import DataExportImport from '../components/DataExportImport';

interface SettingsProps {
  metrics: Metric[];
  onAdd: (name: string, emoji?: string) => void;
  onUpdate: (id: string, changes: Partial<Pick<Metric, 'name' | 'emoji'>>) => void;
  onDelete: (id: string) => void;
  onImport: (data: StorageData) => void;
  onReset: () => void;
}

export default function Settings({ metrics, onAdd, onUpdate, onDelete, onImport, onReset }: SettingsProps) {
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-bold">Settings</h2>
      <MetricManager metrics={metrics} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} />
      <hr className="border-slate-200 dark:border-slate-700" />
      <DataExportImport onImport={onImport} />
      <hr className="border-slate-200 dark:border-slate-700" />
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg text-red-600 dark:text-red-400">Danger zone</h3>
        <button
          onClick={() => setShowResetModal(true)}
          className="self-start bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-red-700"
        >
          Reset all data
        </button>
      </div>

      {/* Reset confirmation modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowResetModal(false)}>
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 mx-4 max-w-sm w-full flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Reset all data?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              This will permanently delete all your scores and metrics. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-200 dark:bg-slate-700 cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onReset();
                  setShowResetModal(false);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white cursor-pointer hover:bg-red-700"
              >
                Delete everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
