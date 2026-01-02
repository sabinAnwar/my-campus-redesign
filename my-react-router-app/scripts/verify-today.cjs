const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function verify() {
  const sabin = await p.user.findFirst({
    where: { email: 'sabin.elanwar@iu-study.org' },
    include: {
      scheduleEvents: { 
        where: {
          date: {
            gte: new Date('2025-12-31T00:00:00'),
            lt: new Date('2026-01-01T00:00:00')
          }
        },
        orderBy: { startTime: 'asc' } 
      }
    }
  });

  console.log('\n===== TODAY\'S EVENTS (31.12.2025) =====\n');
  console.log('Total events today:', sabin.scheduleEvents.length);
  console.log('');
  
  for (const e of sabin.scheduleEvents) {
    console.log(`${e.startTime}-${e.endTime} | ${e.title}`);
    console.log(`             📍 ${e.location}`);
    console.log(`             👤 ${e.professor || 'TBD'}`);
    console.log('');
  }

  await p.$disconnect();
}

verify();
