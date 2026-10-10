import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  getMe
} from "../controllers/auth.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "../schemas/auth.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/refresh", refresh);

router.post("/logout", logout);

// router.get("/me", verifyJWT, getMe);

export default router;