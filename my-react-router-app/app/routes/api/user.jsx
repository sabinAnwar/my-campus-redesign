import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function loader({ request }) {
  if (request.method !== "GET") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    // Get session from cookies
    const cookieHeader = request.headers.get("Cookie") || "";
    const sessionToken = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("session="))
      ?.split("=")[1];

    if (!sessionToken) {
      console.log("❌ No session token found");
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Look up session in database
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session) {
      console.log("❌ Session not found in database");
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if session is expired
    if (new Date() > session.expiresAt) {
      console.log("❌ Session expired");
      // Delete expired session
      await prisma.session.delete({ where: { id: session.id } });
      return Response.json(
        { error: "Session expired" },
        { status: 401 }
      );
    }

    // Return user data
    return Response.json(
      {
        user: {
          id: session.user.id,
          name: session.user.name || "Student",
          email: session.user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return Response.json(
      { error: "An error occurred fetching user data" },
      { status: 500 }
    );
  }
}
