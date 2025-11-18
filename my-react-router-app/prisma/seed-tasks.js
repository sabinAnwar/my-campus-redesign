import "dotenv/config";
import { PrismaClient, TaskKind } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding student tasks...");

  // Try to attach tasks to a known demo user, but allow null userId
  const demoUser =
    (await prisma.user.findUnique({
      where: { email: "student@iu.edu" },
    })) ||
    (await prisma.user.findFirst());

  const userId = demoUser?.id ?? null;

  const tasks = [
    {
      title: "Hausarbeit: Digitale Transformation im E-Commerce",
      course: "E-Commerce",
      kind: TaskKind.ABGABE,
      type: "Hausarbeit",
      dueDate: new Date("2025-11-15"),
    },
    {
      title: "Seminararbeit: Datenbankmodellierung für große Unternehmen",
      course: "Datenbankdesign",
      kind: TaskKind.ABGABE,
      type: "Seminararbeit",
      dueDate: new Date("2025-11-18"),
    },
    {
      title: "Klausur: Wirtschaftsinformatik II",
      course: "Wirtschaftsinformatik",
      kind: TaskKind.KLAUSUR,
      type: "Klausur",
      dueDate: new Date("2025-11-19"),
    },
  ];

  for (const task of tasks) {
    const existing = await prisma.studentTask.findFirst({
      where: {
        title: task.title,
        course: task.course,
        kind: task.kind,
      },
    });

    if (existing) {
      console.log(`↺ Task already exists: ${task.title}`);
      continue;
    }

    await prisma.studentTask.create({
      data: {
        ...task,
        userId,
      },
    });

    console.log(`✅ Created task: ${task.title}`);
  }

  console.log("🎉 Task seeding completed");
}

main()
  .catch((err) => {
    console.error("❌ Error seeding tasks:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

