import type { Metric } from '../types';
import MetricManager from '../components/MetricManager';

interface SettingsProps {
  metrics: Metric[];
  onAdd: (name: string, emoji?: string) => void;
  onUpdate: (id: string, changes: Partial<Pick<Metric, 'name' | 'emoji'>>) => void;
  onDelete: (id: string) => void;
}

export default function Settings({ metrics, onAdd, onUpdate, onDelete }: SettingsProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      <MetricManager metrics={metrics} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} />
    </div>
  );
}
