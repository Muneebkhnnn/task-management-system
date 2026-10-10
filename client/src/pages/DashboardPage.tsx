import { useCallback, useMemo, useState } from 'react';
import Modal from '../components/Modal';
import Navbar from '../components/Navbar';
import TaskForm, { type TaskFormValues } from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { PlusIcon } from '../components/icons';
import { useTasks } from '../hooks/useTasks';
import type { Task, TaskStatus } from '../types';
import { dateInputToIso } from '../utils/date';

type Filter = 'ALL' | TaskStatus;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'IN_PROGRESS', label: 'In progress' },
  { key: 'COMPLETED', label: 'Completed' },
];

export default function DashboardPage() {
  const {
    tasks,
    isLoading,
    isMutating,
    error,
    addTask,
    editTask,
    removeTask,
    markTaskCompleted,
    fetchTasks,
  } = useTasks();

  const [filter, setFilter] = useState<Filter>('ALL');
  const [editing, setEditing] = useState<Task | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const counts = useMemo(() => {
    const result: Record<Filter, number> = {
      ALL: tasks.length,
      PENDING: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
    };

    tasks.forEach((task) => {
      result[task.status] += 1;
    });

    return result;
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const filtered =
      filter === 'ALL'
        ? tasks
        : tasks.filter((task) => task.status === filter);

    return [...filtered].sort((a, b) => {
      const completedDifference =
        Number(a.status === 'COMPLETED') -
        Number(b.status === 'COMPLETED');

      return completedDifference || b.createdAt.localeCompare(a.createdAt);
    });
  }, [tasks, filter]);

  const closeForm = useCallback(() => {
    setEditing(null);
    setFormError(null);
  }, []);

  const closeDelete = useCallback(() => {
    setDeleting(null);
  }, []);

  const openForm = (target: Task | 'new') => {
    setFormError(null);
    setEditing(target);
  };

  const handleSave = async (values: TaskFormValues) => {
    if (!editing) return;

    setFormError(null);

    try {
      if (editing === 'new') {
        await addTask({
          title: values.title.trim(),
          description: values.description.trim() || undefined,
          status: values.status,
          dueDate: values.dueDate
            ? dateInputToIso(values.dueDate)
            : undefined,
        });
      } else {
        await editTask(editing.id, {
          title: values.title.trim(),
          description: values.description.trim(),
          status: values.status,
          ...(values.dueDate
            ? { dueDate: dateInputToIso(values.dueDate) }
            : {}),
        });
      }

      closeForm();
    } catch (caughtError: unknown) {
      setFormError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Could not save the task.',
      );
    }
  };

  const handleToggle = async (task: Task) => {
    setActionError('');

    try {
      if (task.status === 'COMPLETED') {
        await editTask(task.id, { status: 'PENDING' });
      } else {
        await markTaskCompleted(task.id);
      }
    } catch (caughtError: unknown) {
      setActionError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Could not update the task.',
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;

    setActionError('');

    try {
      await removeTask(deleting.id);
      closeDelete();
    } catch (caughtError: unknown) {
      setActionError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Could not delete the task.',
      );
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-190 px-4 pb-28 pt-6 md:px-6 md:pb-16 md:pt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[1.75rem] font-bold leading-[1.2] tracking-[-0.02em] md:text-[2rem]">Your tasks</h1>
            <p className="mt-1 text-(--muted)">
              {counts.COMPLETED} of {counts.ALL} completed
            </p>
          </div>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-(--radius) border border-transparent bg-(--brand) px-4.5 font-semibold text-white hover:bg-(--brand-ink) max-sm:fixed max-sm:bottom-4 max-sm:right-4 max-sm:z-20 max-sm:min-h-13 max-sm:px-5 max-sm:shadow-[0_6px_18px_rgba(58,63,143,0.35)]"
            onClick={() => openForm('new')}
          >
            <PlusIcon />
            <span>New task</span>
          </button>
        </div>

        <div
          className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none"
          role="tablist"
          aria-label="Filter tasks by status"
        >
          {FILTERS.map((item) => (
            <button
              key={item.key}
              role="tab"
              aria-selected={filter === item.key}
              className={`min-h-10 flex-none rounded-full border px-3.5 font-medium ${
                filter === item.key
                  ? 'border-(--brand) bg-(--brand) text-white'
                  : 'border-(--line) bg-(--surface) text-(--muted)'
              }`}
              onClick={() => setFilter(item.key)}
            >
              {item.label} <span className="ml-1 opacity-80 tabular-nums">{counts[item.key]}</span>
            </button>
          ))}
        </div>

        {actionError && (
          <p className="mb-3 rounded-(--radius) bg-(--danger-bg) px-3 py-2.5 text-[0.9rem] text-(--danger)" role="alert">
            {actionError}
          </p>
        )}

        {isLoading && tasks.length === 0 && (
          <p className="py-10 text-center text-(--muted)">Loading your tasks…</p>
        )}

        {error && tasks.length === 0 && !isLoading && (
          <div className="py-10 text-center">
            <p className="mb-3 rounded-(--radius) bg-(--danger-bg) px-3 py-2.5 text-[0.9rem] text-(--danger)">{error}</p>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-(--radius) border border-(--line) bg-(--surface) px-4.5 font-semibold hover:bg-(--bg)"
              onClick={() => void fetchTasks()}
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && tasks.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-lg font-semibold">No tasks yet.</p>
            <button
              className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-(--radius) border border-transparent bg-(--brand) px-4.5 font-semibold text-white hover:bg-(--brand-ink)"
              onClick={() => openForm('new')}
            >
              Add your first task
            </button>
          </div>
        )}

        {!isLoading && tasks.length > 0 && visibleTasks.length === 0 && (
          <p className="py-10 text-center text-(--muted)">No tasks with this status.</p>
        )}

        {visibleTasks.length > 0 && (
          <TaskList
            tasks={visibleTasks}
            pendingIds={isMutating ? visibleTasks.map((task) => task.id) : []}
            onToggle={(task) => void handleToggle(task)}
            onEdit={openForm}
            onDelete={setDeleting}
          />
        )}
      </main>

      {editing && (
        <Modal
          title={editing === 'new' ? 'New task' : 'Edit task'}
          onClose={closeForm}
        >
          <TaskForm
            initial={editing === 'new' ? undefined : editing}
            submitting={isMutating}
            error={formError}
            onSubmit={(values) => void handleSave(values)}
            onCancel={closeForm}
          />
        </Modal>
      )}

      {deleting && (
        <Modal title="Delete task" onClose={closeDelete}>
          <p className="mb-4 wrap-anywhere text-(--muted)">
            Delete “{deleting.title}”? This can’t be undone.
          </p>
          <div className="mt-2 flex justify-end gap-2.5 max-sm:[&>button]:flex-1">
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-(--radius) border border-(--line) bg-(--surface) px-4.5 font-semibold hover:bg-(--bg)" onClick={closeDelete}>
              Cancel
            </button>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-(--radius) border border-transparent bg-(--danger) px-4.5 font-semibold text-white hover:brightness-95 disabled:opacity-60"
              onClick={() => void handleConfirmDelete()}
              disabled={isMutating}
            >
              Delete task
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
