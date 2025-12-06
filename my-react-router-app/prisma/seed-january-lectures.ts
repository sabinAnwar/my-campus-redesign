import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user found");
    return;
  }

  // Delete existing events
  await prisma.scheduleEvent.deleteMany({ where: { userId: user.id } });

  // Create events for January 2026 - Theoriewoche mit Vorlesungen
  const events = [
    // === WOCHE 1: 5.-9. Januar 2026 ===
    // Montag 5. Januar
    {
      title: "Einführung Softwareentwicklung",
      courseCode: "DLBINGSE01",
      eventType: "VORLESUNG",
      date: new Date("2026-01-05"),
      startTime: "09:00",
      endTime: "12:00",
      location: "Hammerbrook",
      professor: "Prof. Dr. Schmidt",
    },
    {
      title: "Mathematik II",
      courseCode: "DLBINGMT02",
      eventType: "VORLESUNG",
      date: new Date("2026-01-05"),
      startTime: "14:00",
      endTime: "16:00",
      location: "Online",
      professor: "Dr. Weber",
    },
    // Dienstag 6. Januar
    {
      title: "Datenbanken",
      courseCode: "DLBINGDB01",
      eventType: "VORLESUNG",
      date: new Date("2026-01-06"),
      startTime: "09:00",
      endTime: "12:00",
      location: "Waterloohain",
      professor: "Prof. Dr. Müller",
    },
    {
      title: "Datenbanken Q&A Sprint",
      courseCode: "DLBINGDB01",
      eventType: "TUTORIUM",
      date: new Date("2026-01-06"),
      startTime: "14:00",
      endTime: "15:30",
      location: "Online",
      professor: "Tutor Schmidt",
    },
    // Mittwoch 7. Januar
    {
      title: "Webentwicklung",
      courseCode: "DLBINGWP01",
      eventType: "VORLESUNG",
      date: new Date("2026-01-07"),
      startTime: "09:00",
      endTime: "12:00",
      location: "HH - Christoph-Probst-Weg",
      professor: "Prof. Dr. Nowak",
    },
    {
      title: "React Workshop",
      courseCode: "DLBINGWP01",
      eventType: "WORKSHOP",
      date: new Date("2026-01-07"),
      startTime: "13:30",
      endTime: "17:00",
      location: "Online",
      professor: "Prof. Dr. Nowak",
    },
    // Donnerstag 8. Januar
    {
      title: "Statistik",
      courseCode: "DLBINGST01",
      eventType: "VORLESUNG",
      date: new Date("2026-01-08"),
      startTime: "10:00",
      endTime: "12:30",
      location: "Online",
      professor: "Dr. Becker",
    },
    {
      title: "Mathe Tutorium",
      courseCode: "DLBINGMT02",
      eventType: "TUTORIUM",
      date: new Date("2026-01-08"),
      startTime: "14:00",
      endTime: "15:30",
      location: "Online",
      professor: "Tutor Meier",
    },
    // Freitag 9. Januar
    {
      title: "Projektmanagement",
      courseCode: "DLBINGPM01",
      eventType: "SEMINAR",
      date: new Date("2026-01-09"),
      startTime: "09:00",
      endTime: "12:00",
      location: "Hammerbrook",
      professor: "Klein, Holger",
    },

    // === WOCHE 2: 12.-16. Januar 2026 ===
    // Montag 12. Januar
    {
      title: "Algorithmen & Datenstrukturen",
      courseCode: "DLBINGAD01",
      eventType: "VORLESUNG",
      date: new Date("2026-01-12"),
      startTime: "09:00",
      endTime: "12:00",
      location: "Waterloohain",
      professor: "Prof. Dr. Fischer",
    },
    {
      title: "Softwarearchitektur",
      courseCode: "DLBINGSA01",
      eventType: "VORLESUNG",
      date: new Date("2026-01-12"),
      startTime: "14:00",
      endTime: "17:00",
      location: "Online",
      professor: "Prof. Dr. Braun",
    },
    // Dienstag 13. Januar
    {
      title: "Cloud Computing",
      courseCode: "DLBINGCC01",
      eventType: "VORLESUNG",
      date: new Date("2026-01-13"),
      startTime: "09:00",
      endTime: "12:00",
      location: "Online",
      professor: "Dr. Hoffmann",
    },
    {
      title: "AWS Workshop",
      courseCode: "DLBINGCC01",
      eventType: "WORKSHOP",
      date: new Date("2026-01-13"),
      startTime: "13:30",
      endTime: "16:30",
      location: "Online",
      professor: "Dr. Hoffmann",
    },
    // Mittwoch 14. Januar
    {
      title: "Machine Learning Grundlagen",
      courseCode: "DLBINGML01",
      eventType: "VORLESUNG",
      date: new Date("2026-01-14"),
      startTime: "09:00",
      endTime: "12:00",
      location: "Hammerbrook",
      professor: "Prof. Dr. Krause",
    },
    {
      title: "Python für ML",
      courseCode: "DLBINGML01",
      eventType: "WORKSHOP",
      date: new Date("2026-01-14"),
      startTime: "14:00",
      endTime: "17:00",
      location: "Online",
      professor: "Prof. Dr. Krause",
    },
    // Donnerstag 15. Januar
    {
      title: "Cybersecurity",
      courseCode: "DLBINGCS01",
      eventType: "VORLESUNG",
      date: new Date("2026-01-15"),
      startTime: "10:00",
      endTime: "13:00",
      location: "Waterloohain",
      professor: "Dr. Schwarz",
    },
    {
      title: "Security Q&A",
      courseCode: "DLBINGCS01",
      eventType: "TUTORIUM",
      date: new Date("2026-01-15"),
      startTime: "14:30",
      endTime: "16:00",
      location: "Online",
      professor: "Dr. Schwarz",
    },
    // Freitag 16. Januar
    {
      title: "Agile Methoden",
      courseCode: "DLBINGAM01",
      eventType: "SEMINAR",
      date: new Date("2026-01-16"),
      startTime: "09:00",
      endTime: "12:00",
      location: "Hammerbrook",
      professor: "Klein, Holger",
    },
    {
      title: "Scrum Simulation",
      courseCode: "DLBINGAM01",
      eventType: "WORKSHOP",
      date: new Date("2026-01-16"),
      startTime: "13:00",
      endTime: "16:00",
      location: "Hammerbrook",
      professor: "Klein, Holger",
    },

    // === WOCHE 3: 19.-23. Januar 2026 ===
    // Montag 19. Januar
    {
      title: "DevOps & CI/CD",
      courseCode: "DLBINGDO01",
      eventType: "VORLESUNG",
      date: new Date("2026-01-19"),
      startTime: "09:00",
      endTime: "12:00",
      location: "Online",
      professor: "Dr. Huber",
    },
    {
      title: "Docker Workshop",
      courseCode: "DLBINGDO01",
      eventType: "WORKSHOP",
      date: new Date("2026-01-19"),
      startTime: "14:00",
      endTime: "17:00",
      location: "Online",
      professor: "Dr. Huber",
    },
    // Dienstag 20. Januar
    {
      title: "Künstliche Intelligenz",
      courseCode: "DLBINGKI01",
      eventType: "VORLESUNG",
      date: new Date("2026-01-20"),
      startTime: "09:00",
      endTime: "12:00",
      location: "Hammerbrook",
      professor: "Prof. Dr. Richter",
    },
    {
      title: "KI Tutorium",
      courseCode: "DLBINGKI01",
      eventType: "TUTORIUM",
      date: new Date("2026-01-20"),
      startTime: "14:00",
      endTime: "15:30",
      location: "Online",
      professor: "Tutor Weber",
    },
    // Mittwoch 21. Januar
    {
      title: "Mobile Development",
      courseCode: "DLBINGMD01",
      eventType: "VORLESUNG",
      date: new Date("2026-01-21"),
      startTime: "09:00",
      endTime: "12:00",
      location: "Waterloohain",
      professor: "Prof. Dr. Lang",
    },
    {
      title: "React Native Hands-on",
      courseCode: "DLBINGMD01",
      eventType: "WORKSHOP",
      date: new Date("2026-01-21"),
      startTime: "13:30",
      endTime: "17:00",
      location: "Online",
      professor: "Prof. Dr. Lang",
    },
    // Donnerstag 22. Januar
    {
      title: "Data Analytics",
      courseCode: "DLBINGDA01",
      eventType: "VORLESUNG",
      date: new Date("2026-01-22"),
      startTime: "10:00",
      endTime: "12:30",
      location: "Online",
      professor: "Dr. Klein",
    },
    {
      title: "Power BI Workshop",
      courseCode: "DLBINGDA01",
      eventType: "WORKSHOP",
      date: new Date("2026-01-22"),
      startTime: "14:00",
      endTime: "17:00",
      location: "Online",
      professor: "Dr. Klein",
    },
    // Freitag 23. Januar
    {
      title: "Klausurvorbereitung Datenbanken",
      courseCode: "DLBINGDB01",
      eventType: "TUTORIUM",
      date: new Date("2026-01-23"),
      startTime: "09:00",
      endTime: "12:00",
      location: "Online",
      professor: "Prof. Dr. Müller",
    },
    {
      title: "Klausurvorbereitung Mathe",
      courseCode: "DLBINGMT02",
      eventType: "TUTORIUM",
      date: new Date("2026-01-23"),
      startTime: "14:00",
      endTime: "16:00",
      location: "Online",
      professor: "Dr. Weber",
    },

    // === WOCHE 4: 26.-30. Januar 2026 - PRÜFUNGSWOCHE ===
    // Montag 26. Januar
    {
      title: "Klausur: Mathematik II",
      courseCode: "DLBINGMT02",
      eventType: "PRUEFUNG",
      date: new Date("2026-01-26"),
      startTime: "09:00",
      endTime: "11:00",
      location: "Hammerbrook",
      professor: "Dr. Weber",
    },
    // Dienstag 27. Januar
    {
      title: "Klausur: Datenbanken",
      courseCode: "DLBINGDB01",
      eventType: "PRUEFUNG",
      date: new Date("2026-01-27"),
      startTime: "10:00",
      endTime: "12:00",
      location: "Waterloohain",
      professor: "Prof. Dr. Müller",
    },
    // Mittwoch 28. Januar
    {
      title: "Klausur: Webentwicklung",
      courseCode: "DLBINGWP01",
      eventType: "PRUEFUNG",
      date: new Date("2026-01-28"),
      startTime: "09:00",
      endTime: "11:00",
      location: "Hammerbrook",
      professor: "Prof. Dr. Nowak",
    },
    // Donnerstag 29. Januar
    {
      title: "Mündliche Prüfung: Projektmanagement",
      courseCode: "DLBINGPM01",
      eventType: "PRUEFUNG",
      date: new Date("2026-01-29"),
      startTime: "10:00",
      endTime: "16:00",
      location: "Hammerbrook",
      professor: "Klein, Holger",
    },
    // Freitag 30. Januar
    {
      title: "Klausur: Statistik",
      courseCode: "DLBINGST01",
      eventType: "PRUEFUNG",
      date: new Date("2026-01-30"),
      startTime: "09:00",
      endTime: "11:00",
      location: "Waterloohain",
      professor: "Dr. Becker",
    },
  ];

  // Insert all events
  for (const event of events) {
    await prisma.scheduleEvent.create({
      data: {
        ...event,
        userId: user.id,
      },
    });
  }

  console.log(`Created ${events.length} events for January 2026`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
