const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function verify() {
  const sabin = await p.user.findFirst({
    where: { email: 'sabin.elanwar@iu-study.org' },
    include: {
      praxisPartner: true,
      praxisHoursTarget: true,
      scheduleEvents: { orderBy: { date: 'asc' } }
    }
  });

  console.log('\n===== SABIN VERIFICATION =====\n');
  console.log('Praxis Partner:', sabin.praxisPartner?.companyName);
  console.log('Supervisor:', sabin.praxisPartner?.supervisor);
  console.log('Address:', sabin.praxisPartner?.address);
  console.log('\nHours Target:', sabin.praxisHoursTarget?.requiredHours, 'hours');
  console.log('Target/Week:', sabin.praxisHoursTarget?.targetPerWeek, 'hours');

  const hoursLogged = await p.praxisHoursLog.aggregate({
    where: { userId: sabin.id },
    _sum: { hours: true },
    _count: true
  });
  console.log('\nTotal Days Logged:', hoursLogged._count);
  console.log('Total Hours Logged:', Math.round(hoursLogged._sum.hours || 0));

  console.log('\n===== SCHEDULE EVENTS =====\n');
  for (const e of sabin.scheduleEvents) {
    const date = e.date.toISOString().split('T')[0];
    console.log(`${date} | ${e.startTime}-${e.endTime} | ${e.eventType.padEnd(10)} | ${e.title} | ${e.location || 'TBD'}`);
  }

  await p.$disconnect();
}

verify();
