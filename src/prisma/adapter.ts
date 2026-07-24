import "dotenv/config";

const dbMode = process.env.DB_MODE;

if (!dbMode) {
  throw new Error("DB_MODE is not defined");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

if (dbMode !== "postgres" && dbMode !== "sqlite") {
  throw new Error("Invalid database mode");
}

let prismaInstance: any = null;

export function getPrisma() {
  if (prismaInstance) {
    return prismaInstance;
  }

  if (dbMode === "postgres") {
    const { prisma } = require("./adapter-postgres");
    prismaInstance = prisma;
  } else {
    const { prisma } = require("./adapter-sqlite");
    prismaInstance = prisma;
  }

  return prismaInstance;
}

export const prisma = getPrisma();