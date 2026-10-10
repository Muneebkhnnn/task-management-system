import type { Task, TaskStatus } from '../types';
import { formatDue, isOverdue } from '../utils/date';
import { CheckIcon, EditIcon, TrashIcon } from './icons';

export const STATUS_LABEL: Record<TaskStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
};

const STATUS_CLASS: Record<TaskStatus, string> = {
  PENDING: 'bg-(--amber-bg) text-(--amber)',
  IN_PROGRESS: 'bg-(--blue-bg) text-(--blue)',
  COMPLETED: 'bg-(--green-bg) text-(--green)',
};

interface TaskItemProps {
  task: Task;
  busy: boolean;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskItem({
  task,
  busy,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const done = task.status === 'COMPLETED';
  const overdue = isOverdue(task);

  return (
    <li
      className={`grid grid-cols-[auto_1fr_auto] items-start gap-3 rounded-(--radius) border border-(--line) bg-(--surface) p-3.5 md:px-4.5 md:py-4 ${
        busy ? 'opacity-60' : ''
      }`}
    >
      <button
        type="button"
        className={`mt-px grid h-7 w-7 place-items-center rounded-full border-2 bg-(--surface) p-0 text-white transition-[background,border-color] duration-150 hover:border-(--brand) disabled:opacity-40 ${
          done
            ? 'border-[#1f7a52] bg-[#1f7a52]'
            : 'border-[#9aa5b5]'
        }`}
        onClick={() => onToggle(task)}
        disabled={busy}
        aria-label={
          done
            ? `Mark "${task.title}" as pending`
            : `Mark "${task.title}" as completed`
        }
        aria-pressed={done}
      >
        {done && <CheckIcon />}
      </button>

      <div className="min-w-0">
        <p
          className={`wrap-anywhere font-semibold ${
            done ? 'text-(--muted) line-through' : ''
          }`}
        >
          {task.title}
        </p>

        {task.description && (
          <p className="mt-0.5 wrap-anywhere whitespace-pre-line text-[0.925rem] text-(--muted)">
            {task.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.85rem]">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[0.8rem] font-semibold ${STATUS_CLASS[task.status]}`}
          >
            {STATUS_LABEL[task.status]}
          </span>

          {task.dueDate && (
            <span
              className={
                overdue
                  ? 'font-semibold text-(--danger)'
                  : 'text-(--muted)'
              }
            >
              {overdue ? 'Overdue · ' : 'Due '}
              {formatDue(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="flex">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border-0 bg-transparent text-(--muted) hover:bg-(--bg) hover:text-(--ink) disabled:opacity-40"
          onClick={() => onEdit(task)}
          disabled={busy}
          aria-label={`Edit "${task.title}"`}
        >
          <EditIcon />
        </button>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border-0 bg-transparent text-(--muted) hover:bg-(--danger-bg) hover:text-(--danger) disabled:opacity-40"
          onClick={() => onDelete(task)}
          disabled={busy}
          aria-label={`Delete "${task.title}"`}
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}