import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient with error handling
let prisma: PrismaClient | any;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a mock client for development if initialization fails
// Create a mock client for development if initialization fails
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
    },
    news: {
      findMany: async () => [],
      count: async () => 0,
      findUnique: async () => null,
    },
    studentTask: {
      findMany: async () => [],
      findUnique: async () => null,
      create: async () => null,
      update: async () => null,
      delete: async () => null,
    },
    session: {
      findUnique: async () => null,
      deleteMany: async () => ({ count: 0 }),
    },
    praxisReport: {
      findMany: async () => [],
      findFirst: async () => null,
      upsert: async (_data: any) => _data,
    },
  };
}

// In development, we want to keep the connection alive between hot reloads
if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export { prisma };
