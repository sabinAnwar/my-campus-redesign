import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Sabin's Praxispartner and Study Plan...");

  // Find Sabin
  const sabin = await prisma.user.findFirst({
    where: { email: "sabin.elanwar@iu-study.org" },
  });

  if (!sabin) {
    console.error("❌ Sabin not found. Please run the main seed first.");
    process.exit(1);
  }

  console.log(`✅ Found Sabin: ${sabin.name} (ID: ${sabin.id})`);

  // ============================================
  // 1. SEED PRAXISPARTNER: GARBE Industrial
  // ============================================
  await prisma.praxisPartner.deleteMany({ where: { userId: sabin.id } });

  await prisma.praxisPartner.create({
    data: {
      userId: sabin.id,
      companyName: "GARBE Industrial Real Estate GmbH",
      department: "IT & Digital Solutions",
      supervisor: "Thomas Bergmann",
      email: "t.bergmann@garbe.de",
      phone: "+49 40 35613-400",
      address: "Caffamacherreihe 8, 20355 Hamburg",
    },
  });
  console.log("✅ Created Praxis Partner: GARBE Industrial Real Estate GmbH");

  // ============================================
  // 2. SEED PRAXIS HOURS TARGET
  // ============================================
  await prisma.praxisHoursTarget.deleteMany({ where: { userId: sabin.id } });

  await prisma.praxisHoursTarget.create({
    data: {
      userId: sabin.id,
      requiredHours: 900,
      targetPerWeek: 40,
      semesterStart: new Date("2025-10-01"),
      semesterEnd: new Date("2026-03-31"),
    },
  });
  console.log("✅ Created Praxis Hours Target");

  // ============================================
  // 3. SEED PRAXIS HOURS LOGS (worked during praxis phase)
  // ============================================
  await prisma.praxisHoursLog.deleteMany({ where: { userId: sabin.id } });

  const praxisLogs = [];
  // Oct 1, 2025 to Dec 31, 2025 is the praxis phase
  // Seed logs for the last 60 working days (approx 12 weeks)
  const praxisStart = new Date("2025-10-01");
  let workDay = new Date(praxisStart);
  
  while (workDay <= new Date("2025-12-31")) {
    const dayOfWeek = workDay.getDay();
    // Skip weekends
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      praxisLogs.push({
        userId: sabin.id,
        date: new Date(workDay),
        hours: 8 + Math.random() * 1.5 - 0.5, // 7.5 - 9.5 hours
        description: 
          dayOfWeek === 1 ? "Wochenmeeting & Projektplanung" :
          dayOfWeek === 2 ? "Frontend-Entwicklung" :
          dayOfWeek === 3 ? "Backend-Integration & Testing" :
          dayOfWeek === 4 ? "Code Review & Dokumentation" :
          "Deployment & Sprint Retro",
      });
    }
    workDay.setDate(workDay.getDate() + 1);
  }

  await prisma.praxisHoursLog.createMany({ data: praxisLogs });
  console.log(`✅ Created ${praxisLogs.length} Praxis Hours Logs`);

  // ============================================
  // 4. SEED SCHEDULE EVENTS FOR SABIN
  // ============================================
  //
  // STUDY PLAN for 7th Semester Wirtschaftsinformatik (from studyPlans.ts):
  // - Praxisphase: 01.10.2025 - 31.12.2025 (NO mandatory lectures, only optional)
  // - Theoriephase: 01.01.2026 - 31.03.2026 (regular lectures)
  // - Klausurphase: 15.02.2026 - 21.02.2026 (exam week)
  //
  // User requested:
  // - Today (31.12.2025): E-Commerce Online (optional, since in praxis)
  // - 01.04.2026: Vorlesung E-Commerce (start of new theory block)
  // - 01.07.2026: Bachelorarbeit
  // - 01.09.2026: E-Commerce
  //
  await prisma.scheduleEvent.deleteMany({ where: { userId: sabin.id } });

  const events: Array<{
    userId: number;
    title: string;
    courseCode: string | null;
    date: Date;
    startTime: string;
    endTime: string;
    location: string;
    eventType: "VORLESUNG" | "SEMINAR" | "UEBUNG" | "TUTORIUM" | "WORKSHOP" | "PRUEFUNG" | "SONSTIGES";
    professor: string | null;
    isRecurring?: boolean;
    recurringDays?: string | null;
  }> = [];

  // --------------------------------------
  // TODAY: 31.12.2025 - 4 Events for current courses
  // (Optional during praxis phase)
  // --------------------------------------
  const today = new Date("2025-12-31");
  
  // Event 1: Bachelorarbeit
  events.push({
    userId: sabin.id,
    title: "Bachelorarbeit - Betreuungsgespräch",
    courseCode: "WIR-7-1",
    date: today,
    startTime: "09:00",
    endTime: "10:00",
    location: "Online (Zoom)",
    eventType: "SONSTIGES",
    professor: "Prof. Dr. Müller",
    isRecurring: false,
    recurringDays: null,
  });

  // Event 2: IT-Ethik
  events.push({
    userId: sabin.id,
    title: "IT-Ethik - Online Sprechstunde",
    courseCode: "WIR-7-2",
    date: today,
    startTime: "11:00",
    endTime: "12:00",
    location: "Online (Teams)",
    eventType: "SONSTIGES",
    professor: "Prof. Dr. Schmidt",
    isRecurring: false,
    recurringDays: null,
  });

  // Event 3: E-Commerce
  events.push({
    userId: sabin.id,
    title: "E-Commerce - Projektbesprechung",
    courseCode: "WIR-7-3",
    date: today,
    startTime: "14:00",
    endTime: "15:30",
    location: "Online (Zoom)",
    eventType: "SONSTIGES",
    professor: "Prof. Dr. Wagner",
    isRecurring: false,
    recurringDays: null,
  });

  // Event 4: Praxisprojekt VII
  events.push({
    userId: sabin.id,
    title: "Praxisprojekt VII - Statusmeeting",
    courseCode: "WIR-7-4",
    date: today,
    startTime: "16:00",
    endTime: "17:00",
    location: "GARBE Industrial (Vor Ort)",
    eventType: "WORKSHOP",
    professor: "Thomas Bergmann (Betreuer)",
    isRecurring: false,
    recurringDays: null,
  });

  // --------------------------------------
  // SPECIFIC DATES: 01.01 - 01.04.2026
  // (For dashboard week overview visibility)
  // --------------------------------------
  
  // 01.01.2026 - New Year / Theorie Start
  events.push({
    userId: sabin.id,
    title: "E-Commerce - Semesterauftakt",
    courseCode: "WIR-7-3",
    date: new Date("2026-01-01"),
    startTime: "10:00",
    endTime: "12:00",
    location: "Online (Zoom)",
    eventType: "VORLESUNG",
    professor: "Prof. Dr. Wagner",
  });

  // 01.02.2026 - Bachelorarbeit
  events.push({
    userId: sabin.id,
    title: "Bachelorarbeit - Themenbesprechung",
    courseCode: "WIR-7-1",
    date: new Date("2026-01-02"),
    startTime: "09:00",
    endTime: "11:00",
    location: "Hammerbrook Campus",
    eventType: "SEMINAR",
    professor: "Prof. Dr. Müller",
  });
  events.push({
    userId: sabin.id,
    title: "IT-Ethik - Einführung",
    courseCode: "WIR-7-2",
    date: new Date("2026-01-02"),
    startTime: "14:00",
    endTime: "16:00",
    location: "Online",
    eventType: "VORLESUNG",
    professor: "Prof. Dr. Schmidt",
  });

  // 01.03.2026 - Multiple Events
  events.push({
    userId: sabin.id,
    title: "E-Commerce - Case Study Workshop",
    courseCode: "WIR-7-3",
    date: new Date("2026-01-03"),
    startTime: "09:00",
    endTime: "12:00",
    location: "Hammerbrook Campus",
    eventType: "WORKSHOP",
    professor: "Prof. Dr. Wagner",
  });
  events.push({
    userId: sabin.id,
    title: "Praxisprojekt VII - Meilenstein Review",
    courseCode: "WIR-7-4",
    date: new Date("2026-01-03"),
    startTime: "14:00",
    endTime: "15:30",
    location: "GARBE Industrial (Vor Ort)",
    eventType: "WORKSHOP",
    professor: "Thomas Bergmann",
  });

  // 01.04.2026 - Weekend but special event
  events.push({
    userId: sabin.id,
    title: "Bachelorarbeit - Schreibworkshop",
    courseCode: "WIR-7-1",
    date: new Date("2026-01-04"),
    startTime: "10:00",
    endTime: "13:00",
    location: "Online (Zoom)",
    eventType: "WORKSHOP",
    professor: "Prof. Dr. Müller",
  });

  // --------------------------------------
  // THEORIEPHASE: 05.01.2026 - 14.02.2026
  // Regular weekly lectures for 7th semester courses
  // --------------------------------------
  const theorieCourses = [
    { name: "E-Commerce", code: "WIR-7-3", prof: "Prof. Dr. Wagner" },
    { name: "Bachelorarbeit Kolloquium", code: "WIR-7-1", prof: "Prof. Dr. Müller" },
    { name: "IT-Ethik", code: "WIR-7-2", prof: "Prof. Dr. Schmidt" },
  ];

  // Create weekly lectures for theoriephase (Jan 5 - Feb 14, 2026)
  const theorieStart = new Date("2026-01-05"); // First Monday
  for (let week = 0; week < 6; week++) { // 6 weeks of theory
    for (let courseIdx = 0; courseIdx < theorieCourses.length; courseIdx++) {
      const course = theorieCourses[courseIdx];
      const eventDate = new Date(theorieStart);
      eventDate.setDate(theorieStart.getDate() + (week * 7) + (courseIdx * 2)); // Mon, Wed, Fri

      // Skip weekends
      const dayOfWeek = eventDate.getDay();
      if (dayOfWeek === 0) eventDate.setDate(eventDate.getDate() + 1);
      if (dayOfWeek === 6) eventDate.setDate(eventDate.getDate() + 2);

      events.push({
        userId: sabin.id,
        title: course.name,
        courseCode: course.code,
        date: eventDate,
        startTime: courseIdx === 0 ? "09:00" : courseIdx === 1 ? "11:00" : "14:00",
        endTime: courseIdx === 0 ? "10:30" : courseIdx === 1 ? "12:30" : "15:30",
        location: courseIdx % 2 === 0 ? "Hammerbrook Campus" : "Online",
        eventType: "VORLESUNG",
        professor: course.prof,
      });
    }
  }

  // --------------------------------------
  // KLAUSURPHASE: 15.02.2026 - 21.02.2026
  // Exams for semester 7 courses
  // --------------------------------------
  events.push({
    userId: sabin.id,
    title: "Klausur: E-Commerce",
    courseCode: "WIR-7-3",
    date: new Date("2026-02-16"),
    startTime: "09:00",
    endTime: "11:00",
    location: "Hammerbrook Campus, Raum A1.01",
    eventType: "PRUEFUNG",
    professor: null,
  });

  events.push({
    userId: sabin.id,
    title: "Klausur: IT-Ethik",
    courseCode: "WIR-7-2",
    date: new Date("2026-02-18"),
    startTime: "14:00",
    endTime: "16:00",
    location: "Hammerbrook Campus, Raum A1.02",
    eventType: "PRUEFUNG",
    professor: null,
  });

  // --------------------------------------
  // USER REQUESTED SPECIFIC DATES
  // --------------------------------------
  
  // 01.04.2026 - E-Commerce Vorlesung (start of SS26)
  events.push({
    userId: sabin.id,
    title: "E-Commerce (Sommersemester)",
    courseCode: "WIR-7-3",
    date: new Date("2026-04-01"),
    startTime: "10:00",
    endTime: "11:30",
    location: "Hammerbrook Campus",
    eventType: "VORLESUNG",
    professor: "Prof. Dr. Wagner",
  });

  // 01.07.2026 - Bachelorarbeit Abgabe / Kolloquium
  events.push({
    userId: sabin.id,
    title: "Bachelorarbeit Kolloquium",
    courseCode: "WIR-7-1",
    date: new Date("2026-07-01"),
    startTime: "10:00",
    endTime: "12:00",
    location: "Hammerbrook Campus, Raum B2.10",
    eventType: "PRUEFUNG",
    professor: "Prof. Dr. Müller",
  });

  // 01.09.2026 - E-Commerce (new semester start)
  events.push({
    userId: sabin.id,
    title: "E-Commerce Advanced",
    courseCode: "WIR-7-3",
    date: new Date("2026-09-01"),
    startTime: "09:00",
    endTime: "10:30",
    location: "Online",
    eventType: "VORLESUNG",
    professor: "Prof. Dr. Wagner",
  });

  await prisma.scheduleEvent.createMany({ data: events });
  console.log(`✅ Created ${events.length} Schedule Events for Sabin`);

  // ============================================
  // 5. UPDATE STUDY PLAN in studyPlans.ts
  // (This is a code file, adding documentation comment)
  // ============================================
  console.log("\n📝 Note: The study phases are defined in app/lib/studyPlans.ts");
  console.log("   Current phases for Wirtschaftsinformatik (7th Semester):");
  console.log("   - Praxisphase: 01.10.2025 - 31.12.2025");
  console.log("   - Theoriephase: 01.01.2026 - 31.03.2026");
  console.log("   - Klausurphase: 15.02.2026 - 21.02.2026");

  console.log("\n🎉 Sabin seeding completed!");
  console.log("\n📊 Summary:");
  console.log("   - Praxis Partner: GARBE Industrial Real Estate GmbH");
  console.log(`   - Praxis Hours Logged: ${praxisLogs.length} days`);
  console.log(`   - Schedule Events: ${events.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
