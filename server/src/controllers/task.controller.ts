import type { Request, Response } from "express";
import type { CreateTaskInput, UpdateTaskInput } from "../schemas/task.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createTaskService,
  deleteTaskService,
  getTaskService,
  getTasksService,
  updateTaskService,
} from "../services/task.service.js";
import { ApiError } from "../lib/ApiError.js";

export const createTask = asyncHandler(
  async (req: Request<{}, {}, CreateTaskInput>, res: Response) => {
    const userId = req.user!.userId;

    const task = await createTaskService(userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  },
);

export const getTasks = asyncHandler(
  async (req: Request<{}, {}, {}>, res: Response) => {
    const userId = req.user!.userId;

    const tasks = await getTasksService(userId);

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasks,
    });
  },
);

export const getTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const taskId = req.params.id;

  if (typeof taskId !== "string") {
    throw new ApiError(400, "Invalid task ID");
  }

  const task = await getTaskService(taskId, userId);

  return res.status(200).json({
    success: true,
    task,
  });
});

export const updateTask = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const taskId = req.params.id;

    if (typeof taskId !== "string") {
      throw new ApiError(400, "Invalid task ID");
    }

    const task = await updateTaskService(
      taskId,
      userId,
      req.body as UpdateTaskInput
    );

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  }
); 

export const deleteTask = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const taskId = req.params.id;

    if (typeof taskId !== "string") {
      throw new ApiError(400, "Invalid task ID");
    }

    await deleteTaskService(taskId, userId);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  }
);