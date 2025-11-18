import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function loader({ request }: { request: Request }) {
  if (request.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const cookieHeader = request.headers.get("Cookie") || "";
    const sessionToken = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("session="))
      ?.split("=")[1];

    if (!sessionToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all praxisbericht reports for this user
    const reports = await prisma.praxisReport.findMany({
      where: { userId: session.user.id },
      orderBy: { isoWeekKey: "asc" },
    });

    return Response.json({ reports });
  } catch (error) {
    console.error("❌ Error fetching praxisberichte:", error);
    return Response.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function action({ request, params }: { request: Request; params: any }) {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
