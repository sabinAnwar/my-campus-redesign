import { prisma } from "../../lib/prisma";

function getSessionTokenFromRequest(request: Request): string | null {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader
        .split("; ")
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c) => {
          const idx = c.indexOf("=");
          return idx === -1
            ? [c, ""]
            : [c.slice(0, idx), decodeURIComponent(c.slice(idx + 1))];
        })
    ) as Record<string, string>;
    const headerToken =
      request.headers.get("x-session-token") ||
      request.headers.get("X-Session-Token") ||
      null;
    return cookies.session || cookies.auth_session || headerToken || null;
  } catch {
    return null;
  }
}

async function requireSessionUser(request: Request) {
  const token = getSessionTokenFromRequest(request);
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session?.user) return null;
  return session.user;
}

export async function loader({
  request,
}: {
  request: Request;
}): Promise<Response> {
  const user = await requireSessionUser(request);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({
    reminder_enabled: !!user.reminder_enabled,
    reminder_hour: user.reminder_hour ?? 18,
    reminder_minute: user.reminder_minute ?? 0,
    reminder_timezone: user.reminder_timezone || "Europe/Berlin",
  });
}

export async function action({
  request,
}: {
  request: Request;
}): Promise<Response> {
  const user = await requireSessionUser(request);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let enabledRaw: string = "";
    let hourRaw: string = "";
    let minuteRaw: string = "";
    let tzRaw: string = "";
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await request.formData();
      enabledRaw = (
        form.get("enabled") ??
        form.get("reminder_enabled") ??
        form.get("reminderEnabled") ??
        ""
      ).toString();
      hourRaw = (form.get("hour") ?? form.get("reminder_hour") ?? form.get("reminderHour") ?? "").toString();
      minuteRaw = (
        form.get("minute") ??
        form.get("reminder_minute") ??
        form.get("reminderMinute") ??
        ""
      ).toString();
      const tzCandidate =
        form.get("timezone") ??
        form.get("reminder_timezone") ??
        form.get("reminderTimezone") ??
        user.reminder_timezone;
      tzRaw = (tzCandidate || "Europe/Berlin").toString();
    } else if (contentType.includes("application/json")) {
      const body = await request.json();
      enabledRaw = (body.enabled ?? body.reminder_enabled ?? body.reminderEnabled ?? "").toString();
      hourRaw = (body.hour ?? body.reminder_hour ?? body.reminderHour ?? "").toString();
      minuteRaw = (body.minute ?? body.reminder_minute ?? body.reminderMinute ?? "").toString();
      const tzCandidate =
        body.timezone ?? body.reminder_timezone ?? body.reminderTimezone ?? user.reminder_timezone;
      tzRaw = (tzCandidate || "Europe/Berlin").toString();
    } else {
      const form = await request.formData();
      enabledRaw = (
        form.get("enabled") ??
        form.get("reminder_enabled") ??
        form.get("reminderEnabled") ??
        ""
      ).toString();
      hourRaw = (form.get("hour") ?? form.get("reminder_hour") ?? form.get("reminderHour") ?? "").toString();
      minuteRaw = (
        form.get("minute") ??
        form.get("reminder_minute") ??
        form.get("reminderMinute") ??
        ""
      ).toString();
      const tzCandidate =
        form.get("timezone") ??
        form.get("reminder_timezone") ??
        form.get("reminderTimezone") ??
        user.reminder_timezone;
      tzRaw = (tzCandidate || "Europe/Berlin").toString();
    }

    const enabled =
      enabledRaw === "true" || enabledRaw === "1" || enabledRaw === "on";
    let hour = parseInt(hourRaw, 10);
    if (hour === 24) hour = 0;
    if (!Number.isFinite(hour) || hour < 0 || hour > 23) {
      return Response.json({ error: "Invalid hour" }, { status: 400 });
    }
    let minute = parseInt(minuteRaw, 10);
    if (!Number.isFinite(minute) || minute < 0 || minute > 59) {
      minute = 0;
    }

    const data: {
      reminder_enabled: boolean;
      reminder_hour: number;
      reminder_timezone: string;
    } = {
      reminder_enabled: enabled,
      reminder_hour: hour,
      reminder_timezone: tzRaw,
    };
    let savedMinute: number | null = minute;
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { ...data, reminder_minute: minute },
      });
    } catch (e: unknown) {
      let message = "Unknown error";
      if (e && typeof e === "object" && "message" in e) {
        message = String((e as any).message);
      } else if (typeof e === "string") {
        message = e;
      }
      console.warn(
        "preferences (alt): minute update failed, retrying without minute",
        message
      );
      try {
        await prisma.user.update({ where: { id: user.id }, data });
        savedMinute = null;
      } catch (e2: unknown) {
        let message2 = "Unknown error";
        if (e2 && typeof e2 === "object" && "message" in e2) {
          message2 = String((e2 as any).message);
        } else if (typeof e2 === "string") {
          message2 = e2;
        }
        console.error(
          "preferences (alt): fallback update failed",
          message2
        );
        throw e2;
      }
    }

    return Response.json({
      success: true,
      reminder_enabled: enabled,
      reminder_hour: hour,
      reminder_minute: savedMinute,
      reminder_timezone: tzRaw,
    });
  } catch (err) {
    console.error("reminders.preferences action error", err);
    return Response.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}

export default function RemindersPreferencesApiRoute() {
  return null;
}
