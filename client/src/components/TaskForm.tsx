import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Task, TaskStatus } from '../types';
import { isoToDateInput } from '../utils/date';
import { STATUS_LABEL } from './TaskItem';

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
}

interface TaskFormProps {
  initial?: Task;
  submitting: boolean;
  error: string | null;
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
}

export default function TaskForm({ initial, submitting, error, onSubmit, onCancel }: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    status: initial?.status ?? 'PENDING',
    dueDate: isoToDateInput(initial?.dueDate ?? null),
  });
  
  const [titleError, setTitleError] = useState('');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "title":
      case "description":
      case "dueDate":
        setValues((prev) => ({ ...prev, [name]: value }));
        break;

      case "status":
        setValues((prev) => ({
          ...prev,
          status: value as TaskStatus,
        }));
        break;
    }
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!values.title.trim()) {
      setTitleError('Enter a title for the task.');
      return;
    }
    setTitleError('');
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4 min-w-0 flex-1">
        <label className="mb-1.5 block text-sm font-semibold" htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          className="min-h-11 w-full rounded-(--radius) border border-(--line) bg-(--surface) px-3 py-2 focus:border-(--brand) focus:outline-2 focus:outline-(--brand) focus:outline-offset-0 aria-invalid:border-(--danger)"
          maxLength={200}
          autoFocus
          value={values.title}
          onChange={handleChange}
        />
        {titleError && <p className="mt-1.5 text-sm text-(--danger)">{titleError}</p>}
      </div>

      <div className="mb-4 min-w-0 flex-1">
        <label className="mb-1.5 block text-sm font-semibold" htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          name="description"
          className="min-h-11 w-full resize-y rounded-(--radius) border border-(--line) bg-(--surface) px-3 py-2 focus:border-(--brand) focus:outline-2 focus:outline-(--brand) focus:outline-offset-0"
          rows={3}
          maxLength={2000}
          value={values.description}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-0 md:flex-row md:gap-3">
        <div className="mb-4 min-w-0 flex-1">
          <label
            className="mb-1.5 block text-sm font-semibold"
            htmlFor="status"
          >
            Status
          </label>

          <select
            className="min-h-11 w-full rounded-(--radius) border border-(--line) bg-(--surface) px-3 py-2 focus:border-(--brand) focus:outline-2 focus:outline-(--brand) focus:outline-offset-0"
            id="status"
            name="status"
            value={values.status}
            onChange={handleChange}
          >
            {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 min-w-0 flex-1">
          <label
            className="mb-1.5 block text-sm font-semibold"
            htmlFor="dueDate"
          >
            Due date (optional)
          </label>

          <input
            className="min-h-11 w-full rounded-(--radius) border border-(--line) bg-(--surface) px-3 py-2 focus:border-(--brand) focus:outline-2 focus:outline-(--brand) focus:outline-offset-0"
            id="dueDate"
            name="dueDate"
            type="date"
            value={values.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && <p className="mb-3 rounded-(--radius) bg-(--danger-bg) px-3 py-2.5 text-[0.9rem] text-(--danger)">{error}</p>}

      <div className="mt-2 flex justify-end gap-2.5 max-sm:[&>button]:flex-1">
        <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-(--radius) border border-(--line) bg-(--surface) px-4.5 font-semibold hover:bg-(--bg) disabled:opacity-60" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-(--radius) border border-transparent bg-(--brand) px-4.5 font-semibold text-white hover:bg-(--brand-ink) disabled:opacity-60" disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Save changes' : 'Add task'}
        </button>
      </div>
    </form>
  );
}
