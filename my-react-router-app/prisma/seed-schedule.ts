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

  // Create events for current week (Dec 1-5, 2025) - Monday to Friday
  const events = [
    {
      title: "Webentwicklung",
      courseCode: "DLBINGWP01",
      eventType: "VORLESUNG",
      date: new Date("2025-12-01"),
      startTime: "09:00",
      endTime: "12:00",
      location: "Hammerbrook",
      professor: "Prof. Dr. Schmidt",
    },
    {
      title: "Datenbanken Q&A",
      courseCode: "DLBINGDB01",
      eventType: "TUTORIUM",
      date: new Date("2025-12-01"),
      startTime: "14:00",
      endTime: "15:30",
      location: "Online",
      professor: "Prof. Dr. Müller",
    },
    {
      title: "Mathematik",
      courseCode: "DLBINGMT01",
      eventType: "VORLESUNG",
      date: new Date("2025-12-02"),
      startTime: "10:00",
      endTime: "11:30",
      location: "Waterloohain",
      professor: "Dr. Weber",
    },
    {
      title: "E-Commerce",
      courseCode: "DSBEC01",
      eventType: "SEMINAR",
      date: new Date("2025-12-02"),
      startTime: "14:00",
      endTime: "17:00",
      location: "HH - Christoph-Probst-Weg",
      professor: "Klein, Holger",
    },
    {
      title: "Game Design",
      courseCode: "DLBINGDT01",
      eventType: "VORLESUNG",
      date: new Date("2025-12-03"),
      startTime: "09:00",
      endTime: "12:00",
      location: "Hammerbrook",
      professor: "Prof. Dr. Nowak",
    },
    {
      title: "Mathe Tutorium",
      courseCode: "DLBINGMT01",
      eventType: "TUTORIUM",
      date: new Date("2025-12-04"),
      startTime: "14:00",
      endTime: "15:30",
      location: "Online",
      professor: "Tutor Meier",
    },
    {
      title: "Praxis-Workshop",
      courseCode: "PRAXIS",
      eventType: "WORKSHOP",
      date: new Date("2025-12-05"),
      startTime: "10:00",
      endTime: "14:00",
      location: "Online",
      professor: "Team Praxis",
    },
  ];

  for (const e of events) {
    await prisma.scheduleEvent.create({
      data: { ...e, userId: user.id },
    });
  }

  console.log("Created", events.length, "events for user", user.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
