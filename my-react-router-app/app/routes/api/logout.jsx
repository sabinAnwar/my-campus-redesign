import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function action({ request }) {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    // Get session token from cookies
    const cookies = request.headers.get("cookie") || "";
    const sessionMatch = cookies.match(/session=([^;]+)/);
    const sessionToken = sessionMatch ? sessionMatch[1] : null;

    if (sessionToken) {
      // Delete session from database
      await prisma.session.deleteMany({
        where: { token: sessionToken },
      });
      console.log("✅ Session deleted:", sessionToken);
    }

    return Response.json(
      { success: true, message: "Logged out successfully" },
      {
        status: 200,
        headers: {
          "Set-Cookie": "session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax",
        },
      }
    );
  } catch (error) {
    console.error("❌ Logout error:", error);
    return Response.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
