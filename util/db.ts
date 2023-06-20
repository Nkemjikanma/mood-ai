import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ["query"],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
* This checks if prisma is instantiated already. If it is, it uses the existing instance. If not, it creates a new instance.
*/
