import { prisma } from "~/lib/prisma";

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
    
    // First try to get from cookies
    const cookieHeader = request.headers.get("Cookie") || "";
    console.log("🍪 Cookie header:", cookieHeader);
    
    sessionToken = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("session="))
      ?.split("=")[1];

    // If not in cookies, try to get from X-Session-Token header
    if (!sessionToken) {
      sessionToken = request.headers.get("X-Session-Token");
      if (sessionToken) {
        console.log("📤 Got session token from header");
      }
    }

    console.log("🔑 Session token:", sessionToken);

    if (!sessionToken) {
      console.log("❌ No session token found");
      console.log("📝 Available cookies:", cookieHeader.split("; "));
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
