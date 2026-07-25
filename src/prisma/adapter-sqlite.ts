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

  const dbPath = process.env.DATABASE_URL || "file:./database/paste.db";
  ensureDatabaseFile(dbPath);

  const adapter = new PrismaLibSql({
    url: dbPath,
  });

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

  prismaInstance.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Paste" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "content" TEXT NOT NULL,
      "language" TEXT NOT NULL,
      "expiryTime" DATETIME,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `).catch((err: any) => {
    console.error("Failed to initialize database tables:", err);
  });

  const cleanup = async () => {
    await prismaInstance?.$disconnect();
  };

  process.on("beforeExit", cleanup);
  process.on("exit", cleanup);

  return prismaInstance;
}

export const prisma = getPrisma();
