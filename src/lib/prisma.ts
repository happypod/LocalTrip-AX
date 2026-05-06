import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

type GlobalPrisma = {
  prisma?: PrismaClient;
  pool?: Pool;
};

const globalForPrisma = globalThis as unknown as GlobalPrisma;

function hasEventDelegate(client: PrismaClient) {
  return "event" in client;
}

export const getPrisma = () => {
  if (globalForPrisma.prisma && !hasEventDelegate(globalForPrisma.prisma)) {
    globalForPrisma.prisma = undefined;
    if (globalForPrisma.pool) {
      globalForPrisma.pool.end().catch(() => {});
      globalForPrisma.pool = undefined;
    }
  }

  if (!globalForPrisma.prisma) {
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on("error", (err) => {
      console.error("Unexpected error on idle pg pool client:", err);
      globalForPrisma.prisma = undefined;
      globalForPrisma.pool = undefined;
    });

    const adapter = new PrismaPg(pool);
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ["query"],
    });
    globalForPrisma.pool = pool;
  }
  return globalForPrisma.prisma;
};
