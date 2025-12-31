import { ActionFunctionArgs } from "react-router";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const taskId = formData.get("taskId");
  const fileName = formData.get("fileName");
  const courseName = formData.get("courseName");

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
      }
    });

    // 2. Find the course id if name is provided
    let courseId = null;
    if (courseName) {
      const course = await prisma.course.findFirst({
        where: { name: String(courseName) }
      });
      courseId = course?.id;
    }

    // 3. Create the File record
    const newFile = await prisma.file.create({
      data: {
        name: String(fileName),
        url: "#", // Placeholder for actual storage URL
        fileType: "pdf",
        size: "1.2 MB",
        userId: user.id,
        courseId: courseId
      }
    });

    return Response.json({ success: true, file: newFile });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
