import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Dual Student data...");

  // Get first user or create test user
  let user = await prisma.user.findFirst();
  
  if (!user) {
    console.log("No user found, creating test user...");
    user = await prisma.user.create({
      data: {
        email: "student@iu.de",
        username: "student",
        password: "test123", // In production, this should be hashed
        name: "Max Mustermann",
        role: "STUDENT",
        studyProgram: "Informatik (B.Sc.)",
        matriculationNumber: "123456",
      },
    });
  }

  console.log(`Using user: ${user.name} (ID: ${user.id})`);

  // Seed Praxis Partner
  const existingPartner = await prisma.praxisPartner.findUnique({
    where: { userId: user.id },
  });

  if (!existingPartner) {
    await prisma.praxisPartner.create({
      data: {
        userId: user.id,
        companyName: "TechCorp GmbH",
        department: "Software Development",
        supervisor: "Dr. Maria Schmidt",
        email: "m.schmidt@techcorp.de",
        phone: "+49 40 1234567",
        address: "Hamburger Straße 123, 20095 Hamburg",
      },
    });
    console.log("✅ Created Praxis Partner");
  } else {
    console.log("⏭️ Praxis Partner already exists");
  }

  // Seed Praxis Hours Target
  const existingTarget = await prisma.praxisHoursTarget.findUnique({
    where: { userId: user.id },
  });

  if (!existingTarget) {
    const now = new Date();
    const semesterStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const semesterEnd = new Date(now.getFullYear(), now.getMonth() + 4, 0);

    await prisma.praxisHoursTarget.create({
      data: {
        userId: user.id,
        requiredHours: 900,
        targetPerWeek: 40,
        semesterStart,
        semesterEnd,
      },
    });
    console.log("✅ Created Praxis Hours Target");
  } else {
    console.log("⏭️ Praxis Hours Target already exists");
  }

  // Seed Praxis Hours Logs (last 4 weeks)
  const existingLogs = await prisma.praxisHoursLog.count({
    where: { userId: user.id },
  });

  if (existingLogs === 0) {
    const logs = [];
    const today = new Date();

    // Generate logs for last 20 working days
    for (let i = 0; i < 20; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      logs.push({
        userId: user.id,
        date,
        hours: 8 + Math.random() * 2 - 1, // 7-9 hours
        description: i === 0 ? "Frontend Entwicklung" : 
                     i === 1 ? "Code Review" :
                     i === 2 ? "Sprint Planning" :
                     i === 3 ? "API Integration" :
                     "Projektarbeit",
      });
    }

    await prisma.praxisHoursLog.createMany({ data: logs });
    console.log(`✅ Created ${logs.length} Praxis Hours Logs`);
  } else {
    console.log(`⏭️ ${existingLogs} Praxis Hours Logs already exist`);
  }

  // Seed Schedule Events (this week)
  const existingEvents = await prisma.scheduleEvent.count({
    where: { userId: user.id },
  });

  if (existingEvents === 0) {
    const today = new Date();
    const events = [];

    // Helper to get next weekday
    const getNextWeekday = (dayOffset: number) => {
      const date = new Date(today);
      date.setDate(date.getDate() + dayOffset);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    // Today's events
    events.push(
      {
        userId: user.id,
        title: "Webentwicklung",
        courseCode: "DLBINGWP01",
        date: getNextWeekday(0),
        startTime: "10:00",
        endTime: "11:30",
        location: "Hammerbrook",
        eventType: "VORLESUNG" as const,
        professor: "Prof. Dr. Schmidt",
      },
      {
        userId: user.id,
        title: "Datenbankdesign",
        courseCode: "DLBINGDB01",
        date: getNextWeekday(0),
        startTime: "14:00",
        endTime: "15:00",
        location: "Waterloohain",
        eventType: "SEMINAR" as const,
        professor: "Prof. Dr. Müller",
      },
      {
        userId: user.id,
        title: "Mathematik",
        courseCode: "DLBINGMT01",
        date: getNextWeekday(0),
        startTime: "16:00",
        endTime: "17:30",
        location: "Hamburg-Mitte",
        eventType: "UEBUNG" as const,
        professor: "Dr. Weber",
      }
    );

    // Tomorrow
    events.push(
      {
        userId: user.id,
        title: "Game Design",
        courseCode: "DLBINGDT01",
        date: getNextWeekday(1),
        startTime: "09:00",
        endTime: "10:30",
        location: "Hammerbrook",
        eventType: "VORLESUNG" as const,
        professor: "Prof. Dr. Nowak",
      },
      {
        userId: user.id,
        title: "Tutorium Mathe",
        courseCode: "DLBINGMT01",
        date: getNextWeekday(1),
        startTime: "14:00",
        endTime: "15:30",
        location: "Waterloohain",
        eventType: "TUTORIUM" as const,
        professor: "Tutor Meier",
      }
    );

    // Day after tomorrow
    events.push({
      userId: user.id,
      title: "Game Design",
      courseCode: "DLBINGDT01",
      date: getNextWeekday(2),
      startTime: "10:00",
      endTime: "11:30",
      location: "Hammerbrook",
      eventType: "VORLESUNG" as const,
      professor: "Prof. Dr. Nowak",
    });

    // Day 4 - no events (already empty)

    // Day 5
    events.push(
      {
        userId: user.id,
        title: "E-Commerce",
        courseCode: "DSBEC01",
        date: getNextWeekday(4),
        startTime: "11:30",
        endTime: "13:00",
        location: "Waterloohain",
        eventType: "VORLESUNG" as const,
        professor: "Prof. Dr. Bauer",
      },
      {
        userId: user.id,
        title: "Praxis-Workshop",
        courseCode: null,
        date: getNextWeekday(4),
        startTime: "16:00",
        endTime: "18:00",
        location: "Hammerbrook",
        eventType: "WORKSHOP" as const,
        professor: null,
      }
    );

    await prisma.scheduleEvent.createMany({ data: events });
    console.log(`✅ Created ${events.length} Schedule Events`);
  } else {
    console.log(`⏭️ ${existingEvents} Schedule Events already exist`);
  }

  console.log("🎉 Dual Student seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
