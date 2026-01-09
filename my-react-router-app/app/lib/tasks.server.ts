import { prisma } from "./prisma";
import { TaskKind } from "@prisma/client";

export const canonicalTasks = [
  {
    title: "Online-Klausur: E-Commerce Grundlagen",
    course: "E-Commerce",
    kind: TaskKind.EXAM,
    type: "Online-Klausur",
    dueDate: new Date("2026-12-09"),
  },
  {
    title: "Klausur: Wirtschaftsinformatik II",
    course: "Wirtschaftsinformatik",
    kind: TaskKind.EXAM,
    type: "Klausur",
    dueDate: new Date("2025-11-19"),
  },
  {
    title: "Projektarbeit: Commerce Plattform Redesign",
    course: "Commerce Engineering",
    kind: TaskKind.SUBMISSION,
    type: "Projektarbeit",
    dueDate: new Date("2025-12-20"),
  },
  {
    title: "Bachelorarbeit: Analyse digitaler Marktplätze",
    course: "Bachelorarbeit",
    kind: TaskKind.SUBMISSION,
    type: "Bachelorarbeit",
    dueDate: new Date("2026-03-30"),
  },
  {
    title: "Projektbericht: Praxisprojekt VII",
    course: "Praxisprojekt VII",
    kind: TaskKind.SUBMISSION,
    type: "Projektarbeit",
    dueDate: new Date("2026-02-15"),
  },
];

export async function ensureCanonicalTasks(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { major: { include: { courses: true } } }
  });

  if (!user || !user.major) return;

  // Get courses for the user's current semester
  const semesterCourses = user.major.courses.filter((c: any) => c.semester === user.semester);
  
  // We want exactly 5 tasks per semester
  // If we have fewer than 5 courses, we'll add some generic ones
  // If we have more, we'll take the first 5
  const tasksToCreate = semesterCourses.slice(0, 5).map((course: any, index: number) => {
    // Alternate between EXAM and SUBMISSION
    const isExam = index % 2 === 0;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (index + 1) * 14); // Spread out every 2 weeks

    return {
      title: isExam ? `Klausur: ${course.name}` : `Hausarbeit: ${course.name}`,
      course: course.name,
      kind: isExam ? TaskKind.EXAM : TaskKind.SUBMISSION,
      type: isExam ? "Online-Klausur" : "Hausarbeit",
      due_date: dueDate,
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
      kind: TaskKind.SUBMISSION,
      type: "Portfolio",
      due_date: dueDate,
    });
  }

  await Promise.all(
    tasksToCreate.map(async (task: any) => {
      const existing = await prisma.studentTask.findFirst({
        where: {
          title: task.title,
          course: task.course,
          user_id: userId,
        },
      });

      if (!existing) {
        await prisma.studentTask.create({
          data: { ...task, user_id: userId },
        });
      }
    })
  );
}
