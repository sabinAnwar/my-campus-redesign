import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get all sessions
  const sessions = await prisma.session.findMany({
    include: {
      user: {
        select: { email: true }
      }
    }
  });
  
  console.log('\n=== All Sessions ===');
  const now = new Date();
  sessions.forEach(s => {
    const expired = now > s.expiresAt;
    console.log(`${s.user.email} - expires: ${s.expiresAt.toISOString()} - ${expired ? '❌ EXPIRED' : '✅ ACTIVE'}`);
  });
  
  // Count active vs expired
  const activeCount = await prisma.session.count({
    where: {
      expiresAt: {
        gt: now
      }
    }
  });
  
  const totalCount = await prisma.session.count();
  
  console.log(`\n=== Summary ===`);
  console.log(`Total sessions: ${totalCount}`);
  console.log(`Active sessions: ${activeCount}`);
  console.log(`Expired sessions: ${totalCount - activeCount}`);
  
  // Clean up expired sessions
  const deleted = await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: now
      }
    }
  });
  
  console.log(`\n=== Cleanup ===`);
  console.log(`Deleted ${deleted.count} expired sessions`);
  
  // Final count
  const finalActive = await prisma.session.count({
    where: {
      expiresAt: {
        gt: now
      }
    }
  });
  console.log(`Active sessions after cleanup: ${finalActive}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
