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

export async function getPrisma() {
  if (prismaInstance) {
    return prismaInstance;
  }

  if (dbMode === "postgres") {
    const { prisma } = await import("./adapter-postgres");
    prismaInstance = prisma;
  } else if (dbMode === "libsql") {
    const { prisma } = await import("./adapter-libsql");
    prismaInstance = prisma;
  } else {
    const { prisma } = await import("./adapter-sqlite");
    prismaInstance = prisma;
  }

  return prismaInstance;
}

export const prisma = await getPrisma();