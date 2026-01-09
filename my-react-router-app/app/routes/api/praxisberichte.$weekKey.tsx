import { Prisma } from "@prisma/client";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";
import { LoaderFunctionArgs } from "react-router-dom";

export async function action({ request, params }: LoaderFunctionArgs) {
  if (request.method !== "PUT") {
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

    const { weekKey } = params;
    const body = await request.json();
    const { days, tasks, grade, status } = body;
    const normalizedStatus = (status || "DUE").toUpperCase();

    // Enforce minimum task length only for non-draft submissions
    if (normalizedStatus !== "DRAFT") {
      if (!tasks || tasks.length < 10) {
        return Response.json(
          { error: "Tasks must be at least 10 characters" },
          { status: 400 }
        );
      }
    }

    // Build create/update objects with conditional approved_at set when approved
    const createData = {
      iso_week_key: weekKey,
      user_id: user.id,
      days: days || {},
      tasks: tasks || "",
      grade: grade || 0,
      status: normalizedStatus,
      edited_at: new Date(),
      approved_at: normalizedStatus === "APPROVED" ? new Date() : undefined,
    };
  

    const updateData = {
      days: days || {},
      tasks: tasks || "",
      grade: grade || 0,
      status: normalizedStatus,
      edited_at: new Date(),
      approved_at: normalizedStatus === "APPROVED" ? new Date() : undefined,
    };

    const report = await prisma.practicalReport.upsert({
      where: {
        iso_week_key_user_id: {
          iso_week_key: weekKey,
          user_id: user.id,
        },
      },
      create: createData,
      update: updateData,
    });

    return Response.json(
      {
        ...report,
        isoWeekKey: report.iso_week_key,
        editedAt: report.edited_at,
        approvedAt: report.approved_at,
        createdAt: report.created_at,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error(" Error updating praxisbericht:", error);
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
    // Surface more context to help diagnose 500s in dev
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : (() => {
            try {
              return JSON.stringify(error) || "Failed to update report";
            } catch {
              return "Failed to update report";
            }
          })();
    const code = (error as any)?.code ?? undefined;
    return Response.json({ error: message, code }, { status: 500 });
  }
}

export default function PraxisberichteWeekKeyAPI() {
  return null;
}
