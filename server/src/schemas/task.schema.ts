import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  status: z
    .enum(["PENDING", "IN_PROGRESS", "COMPLETED"])
    .optional(),

  dueDate: z
    .iso.datetime({ error: "Invalid due date" })
    .optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(200, "Title cannot exceed 200 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  status: z
    .enum(["PENDING", "IN_PROGRESS", "COMPLETED"])
    .optional(),

  dueDate: z
    .iso.datetime({ error: "Invalid due date" })
    .optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;