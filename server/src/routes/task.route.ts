import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTask, deleteTask, getTask, getTasks, updateTask } from "../controllers/task.controller.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema.js";

const router = Router();

router.post(
  "/create-task",
  verifyJWT,
  validate(createTaskSchema),
  createTask
);

router.get("/",verifyJWT,getTasks);

router.get("/:id", verifyJWT, getTask);

router.patch(
  "/:id",
  verifyJWT,
  validate(updateTaskSchema),
  updateTask
);

router.delete("/:id", verifyJWT, deleteTask);

export default router;