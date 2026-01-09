
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const date = new Date('2026-01-09'); // Friday
  const nextDay = new Date('2026-01-10');
  
  console.log('Checking events for:', date.toISOString());

  const events = await prisma.scheduleEvent.findMany({
    where: {
      date: {
        gte: date,
        lt: nextDay
      }
    },
    include: { user: true }
  });

  console.log(`Found ${events.length} events.`);
  events.forEach(e => {
    console.log(`- [${e.user.email}] ${e.start_time}-${e.end_time}: ${e.title} (${e.event_type})`);
  });

  const totalEvents = await prisma.scheduleEvent.count();
  console.log(`Total DB Events: ${totalEvents}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
