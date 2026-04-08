import { useState, useEffect } from 'react';

interface DayNoteProps {
  note: string;
  onChange: (text: string) => void;
}

export default function DayNote({ note, onChange }: DayNoteProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(note);

  useEffect(() => {
    setText(note);
    setOpen(!!note);
  }, [note]);

  const handleBlur = () => {
    onChange(text);
    if (!text.trim()) setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 cursor-pointer"
      >
        + Add a note...
      </button>
    );
  }

  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      autoFocus={!note}
      placeholder="How was your day?"
      rows={3}
      className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
    />
  );
}
