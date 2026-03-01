import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateLocations() {
  console.log('🔄 Updating Physical Locations...');
  
  const events = await prisma.scheduleEvent.findMany({
    where: {
      location: 'Campus Hammerbrook A1.03'
    }
  });
  
  let updatedCount = 0;

  for (const event of events) {
    await prisma.scheduleEvent.update({
      where: { id: event.id },
      data: {
        location: 'Christoph-Probst-Weg 28 - 2.46 Udo Lindenberg'
      }
    });
    updatedCount++;
  }

  console.log(`✅ Updated ${updatedCount} events to new location!`);
}

updateLocations()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
