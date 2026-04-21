import { PrismaClient } from "@/app/generated/prisma";

declare global {
  var prisma: PrismaClient | undefined;
}

const db = globalThis.prisma || new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

export default db;
