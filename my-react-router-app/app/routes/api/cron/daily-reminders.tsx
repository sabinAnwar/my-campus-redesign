import { prisma } from "~/services/prisma";
import { createTransporter } from "~/services/email.server";

function getHourInTimezone(tz: string | null | undefined): number {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hour12: false,
      timeZone: tz || "Europe/Berlin",
    });
    const parts = fmt.formatToParts(new Date());
    const hourStr = parts.find((p) => p.type === "hour")?.value || "00";
    return Number(hourStr);
  } catch (_e) {
    return new Date().getUTCHours();
  }
}

function getMinuteInTimezone(tz: string | null | undefined): number {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      minute: "2-digit",
      hour12: false,
      timeZone: tz || "Europe/Berlin",
    });
    const parts = fmt.formatToParts(new Date());
    const minStr = parts.find((p) => p.type === "minute")?.value || "00";
    return Number(minStr);
  } catch (_e) {
    return new Date().getUTCMinutes();
  }
}

function getIsoWeekKey(date: Date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  const weekStr = String(weekNo).padStart(2, "0");
  return `${d.getUTCFullYear()}-W${weekStr}`;
}

export const loader = async ({ request }: { request: Request }) => {
  try {
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret");
    const cronSecret = process.env.CRON_SECRET || null;
    const isLocal =
      process.env.VERCEL !== "1" && process.env.NODE_ENV !== "production";
    const requireSecret =
      process.env.NODE_ENV === "production" ? true : !!cronSecret;
    if (
      !isLocal &&
      !isVercelCron(request) &&
      requireSecret &&
      (!cronSecret || secret !== cronSecret)
    ) {
      return json({ error: "Unauthorized" }, 401);
    }

    const overrideHour = url.searchParams.get("hour");
    const overrideMinute = url.searchParams.get("minute");
    console.log(" daily-reminders (RR) hit", {
      hour: overrideHour,
      minute: overrideMinute,
      userId: url.searchParams.get("userId"),
      self: url.searchParams.get("self"),
    });
    const targetUserIdRaw = url.searchParams.get("userId");
    const selfOnly = url.searchParams.get("self") === "1";

    let users: any[] = [];

    if (selfOnly) {
      const token = getSessionTokenFromRequest(request);
      if (!token) return json({ error: "Unauthorized" }, 401);
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });
      // Fix: access snake_case properties
      if (!session?.user || !session.user.reminder_enabled) {
        return json({ success: true, sent: 0, usersChecked: 0 }, 200);
      }
      users = [
        {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          reminderHour: session.user.reminder_hour,
          reminderMinute: session.user.reminder_minute,
          reminderTimezone: session.user.reminder_timezone,
        },
      ];
    } else if (targetUserIdRaw) {
      const user = await prisma.user.findUnique({
        where: { id: Number(targetUserIdRaw) || -1 },
        select: {
          id: true,
          email: true,
          name: true,
          reminder_hour: true,
          reminder_minute: true,
          reminder_timezone: true,
          reminder_enabled: true,
        },
      });
      users =
        user && user.reminder_enabled
          ? [
              {
                id: user.id,
                email: user.email,
                name: user.name,
                reminderHour: user.reminder_hour,
                reminderMinute: user.reminder_minute,
                reminderTimezone: user.reminder_timezone,
              },
            ]
          : [];
    } else {
      const dbUsers = await prisma.user.findMany({
        where: { reminder_enabled: true },
        select: {
          id: true,
          email: true,
          name: true,
          reminder_hour: true,
          reminder_minute: true,
          reminder_timezone: true,
        },
      });
      // Map to camelCase for consistency in the loop
      users = dbUsers.map(
        (u: {
          id: any;
          email: any;
          name: any;
          reminder_hour: any;
          reminder_minute: any;
          reminder_timezone: any;
        }) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          reminderHour: u.reminder_hour,
          reminderMinute: u.reminder_minute,
          reminderTimezone: u.reminder_timezone,
        }),
      );
    }

    console.log(" daily-reminders (RR) users loaded", users.length);

    const now = new Date();
    const currentWeekKey = getIsoWeekKey(now);

    let sent = 0;
    // Use shared transporter (Gmail only)
    const transporter = await createTransporter();

    // Default preview urls array, although createTransporter (Gmail) won't generate test URLs
    const previewUrls: string[] = [];

    for (const u of users) {
      const tz = u.reminder_timezone || "Europe/Berlin";
      const currentHour = getHourInTimezone(tz);
      const currentMinute = getMinuteInTimezone(tz);

      const currentBucket = Math.floor(currentMinute / 5) * 5;

      const targetHour = overrideHour
        ? parseInt(overrideHour, 10)
        : (u.reminderHour ?? 18);
      const targetMinute = overrideMinute
        ? parseInt(overrideMinute, 10)
        : (u.reminderMinute ?? 0);

      const hourMatches = currentHour === targetHour;
      const minuteMatches =
        targetMinute >= currentBucket && targetMinute < currentBucket + 5;

      if (!hourMatches || !minuteMatches) {
        continue;
      }

      // Fix: Use correct model and fields
      const submitted = await prisma.practicalReport.findFirst({
        where: {
          user_id: u.id,
          iso_week_key: currentWeekKey,
          status: { in: ["SUBMITTED", "APPROVED"] },
        },
      });
      if (submitted) {
        continue;
      }

      const appUrl = process.env.APP_URL || "https://iu-mycampus.me";
      const portalLink = `${appUrl}/praxisbericht2`;
      const mailOptions = {
        from:
          process.env.EMAIL_FROM ||
          process.env.EMAIL_USER ||
          "noreply@iu-portal.com",
        to: u.email,
        subject: "Erinnerung: Praxisbericht heute noch ausfüllen",
        html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                   body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; }
                </style>
              </head>
              <body>
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: #111f60; color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="margin: 0; font-size: 26px;">Erinnerung</h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 16px;">Praxisbericht fällig</p>
                  </div>
                  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
                    <p style="font-size: 18px; margin-bottom: 20px;">Hallo ${u.name || "Student"},</p>
                    
                    <div style="background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #111f60; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                      <p style="margin: 0; font-size: 16px;">Dies ist eine kurze Erinnerung für heute: Bitte denke daran, deinen Praxisbericht für diese Woche auszufüllen.</p>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${portalLink}" style="display: inline-block; background: #111f60; color: #ffffff !important; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 10px; font-size: 16px;">Praxisbericht öffnen</a>
                    </div>
                    
                    <p style="font-size: 14px; color: #999; text-align: center;">
                      Diese Erinnerung wurde um ${String(targetHour).padStart(2, "0")}:${String(targetMinute).padStart(2, "0")} (${tz}) gesendet.
                    </p>
                  </div>
                  <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-radius: 0 0 10px 10px;">
                    <p>&copy; ${new Date().getFullYear()} IU Student Plattform</p>
                    <p style="margin-top: 5px;">Dies ist eine automatische Benachrichtigung.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        text: `Hallo ${u.name || "Student"},\n\nBitte denke daran, deinen Praxisbericht für diese Woche auszufüllen.\n\n${portalLink}\n\nGesendet um ${String(targetHour).padStart(2, "0")}:${String(targetMinute).padStart(2, "0")} (${tz}).`,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        sent++;
        // Remove emailService check since we only support Gmail now
      } catch (err) {
        console.error(`Failed to send reminder to ${u.email}:`, err);
      }
    }

    console.log(" daily-reminders (RR) complete", {
      sent,
      usersChecked: users.length,
      previews: previewUrls.length,
    });
    return json(
      {
        success: true,
        sent,
        usersChecked: users.length,
        ...(previewUrls.length ? { previews: previewUrls } : {}),
      },
      200,
    );
  } catch (error) {
    console.error("cron/daily-reminders route error", error);
    return json({ error: "Failed to run daily reminders" }, 500);
  }
};

function isVercelCron(req: Request) {
  return req.headers.get("x-vercel-cron") === "1";
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getSessionTokenFromRequest(request: Request): string | null {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader
        .split("; ")
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c) => {}),
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
