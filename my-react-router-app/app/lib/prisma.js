import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient with error handling
let prisma;

try {
  prisma = global.prisma || new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
} catch (error) {
  console.error('Failed to initialize Prisma Client:', error);
  // Create a mock client for development if initialization fails
  prisma = {
    user: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => null,
      update: async () => null,
      delete: async () => null,
    }
  };
}

// In development, we want to keep the connection alive between hot reloads
if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export { prisma };
