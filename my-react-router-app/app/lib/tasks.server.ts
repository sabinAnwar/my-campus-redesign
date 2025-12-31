import { prisma } from "./prisma";
import { TaskKind } from "@prisma/client";

export const canonicalTasks = [
  {
    title: "Online-Klausur: E-Commerce Grundlagen",
    course: "E-Commerce",
    kind: TaskKind.KLAUSUR,
    type: "Online-Klausur",
    dueDate: new Date("2026-12-09"),
  },
  {
    title: "Klausur: Wirtschaftsinformatik II",
    course: "Wirtschaftsinformatik",
    kind: TaskKind.KLAUSUR,
    type: "Klausur",
    dueDate: new Date("2025-11-19"),
  },
  {
    title: "Projektarbeit: Commerce Plattform Redesign",
    course: "Commerce Engineering",
    kind: TaskKind.ABGABE,
    type: "Projektarbeit",
    dueDate: new Date("2025-12-20"),
  },
  {
    title: "Bachelorarbeit: Analyse digitaler Marktplätze",
    course: "Bachelorarbeit",
    kind: TaskKind.ABGABE,
    type: "Bachelorarbeit",
    dueDate: new Date("2026-03-30"),
  },
  {
    title: "Projektbericht: Praxisprojekt VII",
    course: "Praxisprojekt VII",
    kind: TaskKind.ABGABE,
    type: "Projektarbeit",
    dueDate: new Date("2026-02-15"),
  },
];

export async function ensureCanonicalTasks(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { studiengang: { include: { courses: true } } }
  });

  if (!user || !user.studiengang) return;

  // Get courses for the user's current semester
  const semesterCourses = user.studiengang.courses.filter(c => c.semester === user.semester);
  
  // We want exactly 5 tasks per semester
  // If we have fewer than 5 courses, we'll add some generic ones
  // If we have more, we'll take the first 5
  const tasksToCreate = semesterCourses.slice(0, 5).map((course, index) => {
    // Alternate between KLAUSUR and ABGABE
    const isExam = index % 2 === 0;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (index + 1) * 14); // Spread out every 2 weeks

    return {
      title: isExam ? `Klausur: ${course.name}` : `Hausarbeit: ${course.name}`,
      course: course.name,
      kind: isExam ? TaskKind.KLAUSUR : TaskKind.ABGABE,
      type: isExam ? "Online-Klausur" : "Hausarbeit",
      dueDate: dueDate,
    };
  });

  // If we still need more tasks to reach 5
  while (tasksToCreate.length < 5) {
    const index = tasksToCreate.length;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (index + 1) * 14);
    
    tasksToCreate.push({
      title: `Zusatzaufgabe ${index + 1}: Portfolio`,
      course: semesterCourses[0]?.name || "Allgemein",
      kind: TaskKind.ABGABE,
      type: "Portfolio",
      dueDate: dueDate,
    });
  }

  await Promise.all(
    tasksToCreate.map(async (task) => {
      const existing = await prisma.studentTask.findFirst({
        where: {
          title: task.title,
          course: task.course,
          userId: userId,
        },
      });

      if (!existing) {
        await prisma.studentTask.create({
          data: { ...task, userId: userId },
        });
      }
    })
  );
}
