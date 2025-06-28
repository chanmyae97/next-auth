import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

type GlobalWithPrisma = typeof globalThis & {
  prisma: PrismaClient | undefined;
};

export const db = (globalThis as GlobalWithPrisma).prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production")
  (globalThis as GlobalWithPrisma).prisma = db;
