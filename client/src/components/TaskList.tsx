import type { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  pendingIds: string[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskList({ tasks, pendingIds, ...handlers }: TaskListProps) {
  return (
    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} busy={pendingIds.includes(task.id)} {...handlers} />
      ))}
    </ul>
  );
}
