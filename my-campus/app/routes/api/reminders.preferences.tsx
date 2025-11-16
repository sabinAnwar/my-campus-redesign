import { prisma } from "../../lib/prisma";

function getSessionTokenFromRequest(request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader
        .split("; ")
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c) => {
          const idx = c.indexOf("=");
          return idx === -1 ? [c, ""] : [c.slice(0, idx), decodeURIComponent(c.slice(idx + 1))];
        })
    );
    const headerToken = request.headers.get("x-session-token") || request.headers.get("X-Session-Token") || null;
    return cookies.session || cookies.auth_session || headerToken || null;
  } catch {
    return null;
  }
}

async function requireSessionUser(request) {
  const token = getSessionTokenFromRequest(request);
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { token }, include: { user: true } });
  if (!session?.user) return null;
  return session.user;
}

export async function loader({ request }) {
  const user = await requireSessionUser(request);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({
    reminderEnabled: !!user.reminderEnabled,
    reminderHour: user.reminderHour ?? 18,
    reminderMinute: user.reminderMinute ?? 0,
    reminderTimezone: user.reminderTimezone || "Europe/Berlin",
  });
}

export async function action({ request }) {
  const user = await requireSessionUser(request);
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let enabledRaw, hourRaw, minuteRaw, tzRaw;
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await request.formData();
      enabledRaw = (
        form.get("enabled") ??
        form.get("reminderEnabled") ??
        ""
      ).toString();
      hourRaw = (form.get("hour") ?? form.get("reminderHour") ?? "").toString();
      minuteRaw = (
        form.get("minute") ??
        form.get("reminderMinute") ??
        ""
      ).toString();
      const tzCandidate =
        form.get("timezone") ??
        form.get("reminderTimezone") ??
        user.reminderTimezone;
      tzRaw = (tzCandidate || "Europe/Berlin").toString();
    } else if (contentType.includes("application/json")) {
      const body = await request.json();
      enabledRaw = (body.enabled ?? body.reminderEnabled ?? "").toString();
      hourRaw = (body.hour ?? body.reminderHour ?? "").toString();
      minuteRaw = (body.minute ?? body.reminderMinute ?? "").toString();
      const tzCandidate =
        body.timezone ?? body.reminderTimezone ?? user.reminderTimezone;
      tzRaw = (tzCandidate || "Europe/Berlin").toString();
    } else {
      const form = await request.formData();
      enabledRaw = (
        form.get("enabled") ??
        form.get("reminderEnabled") ??
        ""
      ).toString();
      hourRaw = (form.get("hour") ?? form.get("reminderHour") ?? "").toString();
      minuteRaw = (
        form.get("minute") ??
        form.get("reminderMinute") ??
        ""
      ).toString();
      const tzCandidate =
        form.get("timezone") ??
        form.get("reminderTimezone") ??
        user.reminderTimezone;
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

    const data = {
      reminderEnabled: enabled,
      reminderHour: hour,
      reminderTimezone: tzRaw,
    };
    let savedMinute = minute;
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { ...data, reminderMinute: minute },
      });
    } catch (e) {
      console.warn(
        "preferences (alt): minute update failed, retrying without minute",
        e?.message
      );
      try {
        await prisma.user.update({ where: { id: user.id }, data });
        savedMinute = null;
      } catch (e2) {
        console.error("preferences (alt): fallback update failed", e2?.message);
        throw e2;
      }
    }

    return Response.json({
      success: true,
      reminderEnabled: enabled,
      reminderHour: hour,
      reminderMinute: savedMinute,
      reminderTimezone: tzRaw,
    });
  } catch (err) {
    console.error("reminders.preferences action error", err);
    return Response.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}

export default function RemindersPreferencesApiRoute() {
  return null;
}
