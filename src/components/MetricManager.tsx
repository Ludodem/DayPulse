import { useState } from 'react';
import type { Metric } from '../types';

interface MetricManagerProps {
  metrics: Metric[];
  onAdd: (name: string, emoji?: string) => void;
  onUpdate: (id: string, changes: Partial<Pick<Metric, 'name' | 'emoji'>>) => void;
  onDelete: (id: string) => void;
}

export default function MetricManager({ metrics, onAdd, onUpdate, onDelete }: MetricManagerProps) {
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmoji, setEditEmoji] = useState('');

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    onAdd(name, newEmoji.trim() || undefined);
    setNewName('');
    setNewEmoji('');
  };

  const startEdit = (metric: Metric) => {
    setEditingId(metric.id);
    setEditName(metric.name);
    setEditEmoji(metric.emoji || '');
  };

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return;
    onUpdate(editingId, { name: editName.trim(), emoji: editEmoji.trim() || undefined });
    setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-lg">Metrics</h3>

      {/* Existing metrics */}
      <div className="flex flex-col gap-2">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700"
          >
            {editingId === metric.id ? (
              <>
                <input
                  value={editEmoji}
                  onChange={(e) => setEditEmoji(e.target.value)}
                  className="w-10 text-center bg-slate-100 dark:bg-slate-700 rounded px-1 py-1 text-sm"
                  placeholder="🎯"
                />
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                  className="flex-1 bg-slate-100 dark:bg-slate-700 rounded px-2 py-1 text-sm"
                  autoFocus
                />
                <button onClick={saveEdit} className="text-emerald-600 text-sm font-medium cursor-pointer">
                  Save
                </button>
                <button onClick={() => setEditingId(null)} className="text-slate-400 text-sm cursor-pointer">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="w-8 text-center">{metric.emoji || '•'}</span>
                <span className="flex-1 text-sm font-medium">{metric.name}</span>
                <button onClick={() => startEdit(metric)} className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer">
                  Edit
                </button>
                <button onClick={() => onDelete(metric.id)} className="text-red-400 hover:text-red-600 text-sm cursor-pointer">
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add new metric */}
      <div className="flex items-center gap-2">
        <input
          value={newEmoji}
          onChange={(e) => setNewEmoji(e.target.value)}
          className="w-10 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1 py-1.5 text-sm"
          placeholder="🎯"
        />
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-sm"
          placeholder="New metric name..."
        />
        <button
          onClick={handleAdd}
          disabled={!newName.trim()}
          className="bg-emerald-600 text-white px-3 py-1.5 rounded text-sm font-medium disabled:opacity-40 cursor-pointer"
        >
          Add
        </button>
      </div>
    </div>
  );
}
