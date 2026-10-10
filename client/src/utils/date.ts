import type { Task } from '../types';

const pad = (value: number) => String(value).padStart(2, '0');

export const dateInputToIso = (value: string) =>
  new Date(`${value}T00:00:00`).toISOString();

export const isoToDateInput = (iso: string | null) => {
  if (!iso) return '';

  const date = new Date(iso);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const formatDue = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const isOverdue = (task: Task) => {
  if (!task.dueDate || task.status === 'COMPLETED') return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(task.dueDate).getTime() < today.getTime();
};
