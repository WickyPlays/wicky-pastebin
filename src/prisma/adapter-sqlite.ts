import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

let prismaInstance: PrismaClient | null = null;

export function getPrisma() {
  if (prismaInstance) {
    return prismaInstance;
  }

  const dbPath = process.env.DATABASE_URL || "file:./database/paste.db";

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

  const cleanup = async () => {
    await prismaInstance?.$disconnect();
  };

  process.on("beforeExit", cleanup);
  process.on("exit", cleanup);

  return prismaInstance;
}

export const prisma = getPrisma();
