import { ApiError } from "../lib/ApiError.js";
import { prisma } from "../lib/db.js"
import type { CreateTaskInput, UpdateTaskInput } from "../schemas/task.schema.js"

export const createTaskService = async (userId: string, data: CreateTaskInput) => {

    const task= await prisma.task.create({
       data: {
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        userId
       }
    })

    return task;
}

export const getTasksService = async (userId: string) => {
    const tasks= await prisma.task.findMany({
        where: {
            userId
        }
    })

    return tasks;
}

export const getTaskService = async (
  taskId: string,
  userId: string
) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};

export const updateTaskService = async (
  taskId: string,
  userId: string,
  data: UpdateTaskInput
) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      ...(data.title !== undefined && {
        title: data.title,
      }),

      ...(data.description !== undefined && {
        description: data.description,
      }),

      ...(data.status !== undefined && {
        status: data.status,
      }),

      ...(data.dueDate !== undefined && {
        dueDate: new Date(data.dueDate),
      }),
    },
  });

  return updatedTask;
};

export const deleteTaskService = async (
  taskId: string,
  userId: string
) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });
};