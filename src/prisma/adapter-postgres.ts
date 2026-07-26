import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

let prismaInstance: PrismaClient | null = null;

export function getPrisma() {
  if (prismaInstance) {
    return prismaInstance;
  }

  const connectionString = process.env.DB_URL;
  if (!connectionString) {
    console.error("FATAL: DB_URL environment variable is missing.");
    throw new Error("DB_URL is not defined");
  }
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);

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
