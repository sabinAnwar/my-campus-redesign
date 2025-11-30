import { prisma } from "~/lib/prisma";

export async function getUserFromRequest(request: Request) {
  // 1. Try to get session from Cookie header
  const cookieHeader = request.headers.get("Cookie");
  let sessionToken = cookieHeader
    ?.split("; ")
    .find((c) => c.startsWith("session="))
    ?.split("=")[1];

  // 2. If not in cookies, try X-Session-Token header (for API calls)
  if (!sessionToken) {
    sessionToken = request.headers.get("X-Session-Token") || undefined;
  }

  if (!sessionToken) return null;

  // 3. Find session in DB
  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  });

  if (!session) return null;

  // 4. Check expiration
  if (new Date() > session.expiresAt) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return session.user;
}
