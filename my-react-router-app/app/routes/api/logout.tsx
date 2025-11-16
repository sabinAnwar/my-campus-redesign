import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Loader for GET requests (should not be used, but prevents HTML response)
export async function loader() {
  return Response.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}

export async function action({ request }: { request: Request }) {
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

// Default export for React Router (not used, but required)
export default function LogoutAPI() {
  return null;
}
