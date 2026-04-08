/** Format a Date to "YYYY-MM-DD" */
export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Get today as "YYYY-MM-DD" */
export function today(): string {
  return toDateString(new Date());
}

/** Parse "YYYY-MM-DD" to Date (local timezone) */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Get all days in a given month as "YYYY-MM-DD" strings */
export function getDaysInMonth(year: number, month: number): string[] {
  const days: string[] = [];
  const daysCount = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysCount; d++) {
    days.push(toDateString(new Date(year, month, d)));
  }
  return days;
}

/** Get the Monday-based day of week (0=Mon, 6=Sun) */
export function getMondayBasedDay(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

/** Format a date string for display: "8 avril 2026" */
export function formatDateLong(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Format month: "Avril 2026" */
export function formatMonth(year: number, month: number): string {
  return new Date(year, month).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });
}
