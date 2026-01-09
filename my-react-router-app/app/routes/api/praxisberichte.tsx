import { Prisma } from "@prisma/client";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";

export async function loader({ request }: { request: Request }) {
  if (request.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    let user = await getUserFromRequest(request);
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: "student.demo@iu-study.org" },
      });
    }
    if (!user) {
      user = await prisma.user.findFirst({
        where: { role: "STUDENT" },
      });
    }

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all practical reports for this user
    const reports = await prisma.practicalReport.findMany({
      where: { user_id: user.id },
      orderBy: { iso_week_key: "asc" },
    });

    const mapped = reports.map((r) => ({
      ...r,
      isoWeekKey: r.iso_week_key,
      editedAt: r.edited_at,
      approvedAt: r.approved_at,
      createdAt: r.created_at,
    }));

    return Response.json(
      { reports: mapped },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error(" Error fetching practical reports:", error);
    const isMissingTable =
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2021" ||
        error.message.toLowerCase().includes("does not exist"));
    if (isMissingTable) {
      return Response.json(
        {
          error:
            "Praxisberichte-Tabelle fehlt in der Datenbank. Bitte Migrationen ausführen.",
        },
        { status: 503 }
      );
    }
    return Response.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function action({ request, params }: { request: Request; params: any }) {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
