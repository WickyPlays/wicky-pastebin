import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

let prismaInstance: PrismaClient | null = null;

function ensureDatabaseFile(dbUrl: string) {
  if (!dbUrl.startsWith("file:")) return;

  const relativePath = dbUrl.replace(/^file:/, "");
  const absolutePath = path.isAbsolute(relativePath)
    ? relativePath
    : path.resolve(process.cwd(), relativePath);

  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(absolutePath)) {
    fs.writeFileSync(absolutePath, "");
  }
}

export function getPrisma() {
  if (prismaInstance) {
    return prismaInstance;
  }

  const dbUrl = process.env.DB_URL;
  if (!dbUrl) {
    console.error("FATAL: DB_URL environment variable is missing.");
    throw new Error("DB_URL is not defined");
  }

  if (dbUrl.startsWith("file:")) {
    ensureDatabaseFile(dbUrl);
  }

  const adapter = new PrismaLibSql({ url: process.env.DB_URL!, authToken: process.env.DB_AUTH_TOKEN! });

  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
  };

  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }

  const cleanup = async () => {
    await prismaInstance?.$disconnect();
  };

  process.on("beforeExit", cleanup);
  process.on("exit", cleanup);

  return prismaInstance;
}

export const prisma = getPrisma();
