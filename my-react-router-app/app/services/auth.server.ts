import { prisma } from "~/services/prisma";

export async function getUserFromRequest(request: Request) {
  // get session from Cookie header
  const cookieHeader = request.headers.get("Cookie");
  let sessionToken = cookieHeader
    ?.split("; ")
    .find((c) => c.startsWith("session="))
    ?.split("=")[1];

  // If not in cookies, try X-Session-Token header (for API calls)
  if (!sessionToken) {
    sessionToken = request.headers.get("X-Session-Token") || undefined;
  }

  if (!sessionToken) return null;

  // Find session in DB
  let session = null;
  try {
    session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { 
        user: {
          include: { major: true }
        } 
      },
    });
  } catch (error) {
    // If the sessions table isn't available yet, fall back to anonymous flow.
    console.warn("Session lookup failed:", error);
    return null;
  }

  if (!session) return null;

  // Check expiration
  if (new Date() > session.expires_at) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return session.user;
}
