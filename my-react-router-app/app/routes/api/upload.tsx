import type { ActionFunctionArgs } from "react-router";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Safely extract string from FormData
 */
function getFormString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" ? value : null;
}

// ============================================================================
// ACTION - Handle file uploads
// ============================================================================

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const taskId = getFormString(formData, "taskId");
  const fileName = getFormString(formData, "fileName");
  const courseName = getFormString(formData, "courseName");

  if (!taskId || !fileName) {
    return Response.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    // 1. Update the student task status
    await prisma.studentTask.update({
      where: { id: Number(taskId) },
      data: {
        // We might want to add a status column to studentTask if it doesn't exist
        // For now, let's just create a File record linked to this user/course
      },
    });

    // 2. Find the course id if name is provided
    let courseId: number | null = null;
    if (courseName) {
      const course = await prisma.course.findFirst({
        where: { name: courseName },
      });
      courseId = course?.id ?? null;
    }

    // 3. Create the File record
    const newFile = await prisma.file.create({
      data: {
        name: fileName,
        url: "#", // Placeholder for actual storage URL
        fileType: "pdf",
        size: "1.2 MB",
        userId: user.id,
        courseId: courseId,
      },
    });

    return Response.json({ success: true, file: newFile });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
