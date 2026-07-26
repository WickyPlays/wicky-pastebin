import "dotenv/config";

if (!process.env.DB_URL) {
  console.error(`
    DB_URL environment variable is missing.
    Please choose a database mode and configure DB_URL in the .env file.
    Available modes: postgres, sqlite, libsql.
  `);
  throw new Error("DB_URL is not defined");
}

const dbMode = process.env.DB_MODE;

if (!dbMode) {
  throw new Error("DB_MODE is not defined");
}

if (dbMode !== "postgres" && dbMode !== "sqlite" && dbMode !== "libsql") {
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
  } else if (dbMode === "libsql") {
    const { prisma } = require("./adapter-libsql");
    prismaInstance = prisma;
  } else {
    const { prisma } = require("./adapter-sqlite");
    prismaInstance = prisma;
  }

  return prismaInstance;
}

export const prisma = getPrisma();