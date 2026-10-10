import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

if (existsSync(".env")) loadEnvFile(".env");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

export const prisma = new PrismaClient({ adapter });