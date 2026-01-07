import { PrismaClient } from "@prisma/client";
import { LoaderFunctionArgs } from "react-router-dom";


const prisma = new PrismaClient();

export async function action({ request, params }: LoaderFunctionArgs) {
  if (request.method !== "PUT") {
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

    // Build create/update objects with conditional approvedAt set when approved
    const createData = {
      isoWeekKey: weekKey,
      userId: session.user.id,
      days: days || {},
      tasks: tasks || "",
      grade: grade || 0,
      status: normalizedStatus,
      editedAt: new Date(),
      approvedAt: normalizedStatus === "APPROVED" ? new Date() : undefined,
    };
  

    const updateData = {
      days: days || {},
      tasks: tasks || "",
      grade: grade || 0,
      status: normalizedStatus,
      editedAt: new Date(),
      approvedAt: normalizedStatus === "APPROVED" ? new Date() : undefined,
    };

    const report = await prisma.praxisReport.upsert({
      where: {
        isoWeekKey_userId: {
          isoWeekKey: weekKey,
          userId: session.user.id,
        },
      },
      create: createData,
      update: updateData,
    });

    return Response.json(report);
  } catch (error) {
    console.error(" Error updating praxisbericht:", error);
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

