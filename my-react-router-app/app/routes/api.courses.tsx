import { prisma } from "~/services/prisma";

async function handleRequest({
  request,
}: {
  request: Request;
}): Promise<Response> {
  if (request.method !== "GET") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    // Get session from cookies or header
    let sessionToken = null;
    const cookieHeader = request.headers.get("Cookie") || "";
    sessionToken = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("session="))
      ?.split("=")[1];

    if (!sessionToken) {
      sessionToken = request.headers.get("X-Session-Token");
    }

    let user = null;
    if (sessionToken) {
      const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
      });
      if (session) user = session.user;
    }

    // Fallback to Demo Student if no user found
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: "student.demo@iu-study.org" },
      });
    }

    if (!user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    let dbCourses: any[] = [];
    if (user.major_id) {
      dbCourses = await prisma.course.findMany({
        where: { major_id: user.major_id },
        orderBy: { semester: "asc" },
      });
    }

    return Response.json({ courses: dbCourses });
  } catch (error) {
    console.error(" Error fetching courses:", error);
    return Response.json(
      { error: "An error occurred fetching courses" },
      { status: 500 }
    );
  }
}

export async function loader({
  request,
}: {
  request: Request;
}): Promise<Response> {
  return handleRequest({ request });
}

export async function action({
  request,
}: {
  request: Request;
}): Promise<Response> {
  return handleRequest({ request });
}
