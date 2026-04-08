import type { Metric, StorageData } from '../types';
import MetricManager from '../components/MetricManager';
import DataExportImport from '../components/DataExportImport';

interface SettingsProps {
  metrics: Metric[];
  onAdd: (name: string, emoji?: string) => void;
  onUpdate: (id: string, changes: Partial<Pick<Metric, 'name' | 'emoji'>>) => void;
  onDelete: (id: string) => void;
  onImport: (data: StorageData) => void;
}

export default function Settings({ metrics, onAdd, onUpdate, onDelete, onImport }: SettingsProps) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-bold">Settings</h2>
      <MetricManager metrics={metrics} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} />
      <hr className="border-slate-200 dark:border-slate-700" />
      <DataExportImport onImport={onImport} />
    </div>
  );
}
