import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateZoomLinks() {
  console.log('🔄 Updating Schedule Events to include Zoom links in location...');
  
  const events = await prisma.scheduleEvent.findMany();
  
  let updatedCount = 0;

  for (const event of events) {
    if (event.location === 'Online (Zoom)') {
      // Alternate the zoom link
      const zoomLink = updatedCount % 2 === 0 
        ? "https://iubh.zoom.us/j/2737360547?pwd=YUltRFk0em1zLy95blBQaUFWZ05CQT09" 
        : "https://iubh.zoom.us/j/9570624041?pwd=RzFZeEZYVVNjRlIvQks1aHY2b1NMZz09#success";

      await prisma.scheduleEvent.update({
        where: { id: event.id },
        data: {
          location: `Online (Zoom) | ${zoomLink}`
        }
      });
      updatedCount++;
    }
  }

  console.log(`✅ Updated ${updatedCount} events with Zoom links!`);
}

updateZoomLinks()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
