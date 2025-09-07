import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient
const prisma = global.prisma || new PrismaClient();

// In development, we want to keep the connection alive between hot reloads
if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export { prisma };
