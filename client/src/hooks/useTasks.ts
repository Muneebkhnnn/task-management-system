import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "../types/index.js";

import {
  getTasks as getTasksRequest,
  createTask as createTaskRequest,
  updateTask as updateTaskRequest,
  deleteTask as deleteTaskRequest,
} from "../services/TaskService.js";

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return (
      error.response?.data?.message ??
      "Request failed. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getTasksRequest();
      setTasks(data);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTask = async (data: CreateTaskPayload) => {
    setIsMutating(true);
    setError(null);

    try {
      const task = await createTaskRequest(data);

      setTasks((previousTasks) => [
        task,
        ...previousTasks,
      ]);

      return task;
    } catch (error: unknown) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  const editTask = async (
    taskId: string,
    data: UpdateTaskPayload
  ) => {
    setIsMutating(true);
    setError(null);

    try {
      const updatedTask = await updateTaskRequest(
        taskId,
        data
      );

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId ? updatedTask : task
        )
      );

      return updatedTask;
    } catch (error: unknown) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  const removeTask = async (taskId: string) => {
    setIsMutating(true);
    setError(null);

    try {
      await deleteTaskRequest(taskId);

      setTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== taskId)
      );
    } catch (error: unknown) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  const markTaskCompleted = async (taskId: string) => {
    return editTask(taskId, {
      status: "COMPLETED",
    });
  };

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    isMutating,
    error,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    markTaskCompleted,
  };
};