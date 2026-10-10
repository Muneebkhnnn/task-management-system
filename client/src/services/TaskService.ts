import { api } from "../api/axios";
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "../types/index.js";

interface TasksResponse {
  success: boolean;
  message: string;
  tasks: Task[];
}

interface TaskResponse {
  success: boolean;
  message?: string;
  task: Task;
}

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get<TasksResponse>("/tasks");
  return response.data.tasks;
};

export const getTaskById = async (
  taskId: string
): Promise<Task> => {
  const response = await api.get<TaskResponse>(
    `/tasks/${taskId}`
  );

  return response.data.task;
};

export const createTask = async (
  data: CreateTaskPayload
): Promise<Task> => {
  const response = await api.post<TaskResponse>(
    "/tasks/create-task",
    data
  );

  return response.data.task;
};

export const updateTask = async (
  taskId: string,
  data: UpdateTaskPayload
): Promise<Task> => {
  const response = await api.patch<TaskResponse>(
    `/tasks/${taskId}`,
    data
  );

  return response.data.task;
};

export const deleteTask = async (
  taskId: string
): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};