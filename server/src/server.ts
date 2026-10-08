process.loadEnvFile();
import express from "express";
import { prisma } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/task.route.js";
import {errorHandler} from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import { verifyJWT } from "./middleware/auth.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(errorHandler);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});