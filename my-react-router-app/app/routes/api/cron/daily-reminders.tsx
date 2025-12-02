import nodemailer from "nodemailer";

import { prisma } from "../../../lib/prisma";

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
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  const weekStr = String(weekNo).padStart(2, "0");
  return `${d.getUTCFullYear()}-W${weekStr}`;
}

export const loader = async ({ request }: { request: Request }) => {
  try {
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret");
    const cronSecret = process.env.CRON_SECRET || null;
    const isLocal = process.env.VERCEL !== "1" && process.env.NODE_ENV !== "production";
    const requireSecret = process.env.NODE_ENV === "production" ? true : !!cronSecret;
    if (!isLocal && !isVercelCron(request) && requireSecret && (!cronSecret || secret !== cronSecret)) {
      return json({ error: "Unauthorized" }, 401);
    }

    const overrideHour = url.searchParams.get("hour");
    const overrideMinute = url.searchParams.get("minute");
    console.log("🚦 daily-reminders (RR) hit", {
      hour: overrideHour,
      minute: overrideMinute,
      userId: url.searchParams.get("userId"),
      self: url.searchParams.get("self"),
    });
    const targetUserIdRaw = url.searchParams.get("userId");
    const selfOnly = url.searchParams.get("self") === "1";

    let users;
    if (selfOnly) {
      const token = getSessionTokenFromRequest(request);
      if (!token) return json({ error: "Unauthorized" }, 401);
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });
      if (!session?.user || !session.user.reminderEnabled) {
        return json({ success: true, sent: 0, usersChecked: 0 }, 200);
      }
      users = [
        {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          reminderHour: session.user.reminderHour,
          reminderMinute: session.user.reminderMinute,
          reminderTimezone: session.user.reminderTimezone,
        },
      ];
    } else if (targetUserIdRaw) {
      const user = await prisma.user.findUnique({
        where: { id: Number(targetUserIdRaw) || -1 },
        select: {
          id: true,
          email: true,
          name: true,
          reminderHour: true,
          reminderMinute: true,
          reminderTimezone: true,
          reminderEnabled: true,
        },
      });
      users =
        user && user.reminderEnabled
          ? [
              {
                id: user.id,
                email: user.email,
                name: user.name,
                reminderHour: user.reminderHour,
                reminderMinute: user.reminderMinute,
                reminderTimezone: user.reminderTimezone,
              },
            ]
          : [];
    } else {
      users = await prisma.user.findMany({
        where: { reminderEnabled: true },
        select: {
          id: true,
          email: true,
          name: true,
          reminderHour: true,
          reminderMinute: true,
          reminderTimezone: true,
        },
      });
    }

    console.log("👥 daily-reminders (RR) users loaded", users.length);

    const now = new Date();
    const currentWeekKey = getIsoWeekKey(now);

    let sent = 0;
    const emailService = process.env.EMAIL_SERVICE || "test";
    console.log(`📧 Email service: ${emailService}`);

    const previewUrls: string[] = [];
    let transporter;
    if (emailService === "gmail") {
      transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else if (emailService === "sendgrid") {
      transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        auth: { user: "apikey", pass: process.env.SENDGRID_API_KEY },
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
    }

    for (const u of users) {
      const tz = u.reminderTimezone || "Europe/Berlin";
      const currentHour = getHourInTimezone(tz);
      const currentMinute = getMinuteInTimezone(tz);
      
      // Round current minute down to nearest 5 to create a 5-minute bucket
      // This handles cases where the cron runs slightly late (e.g. 18:01 instead of 18:00)
      const currentBucket = Math.floor(currentMinute / 5) * 5;

      const targetHour = overrideHour ? parseInt(overrideHour, 10) : u.reminderHour ?? 18;
      const targetMinute = overrideMinute ? parseInt(overrideMinute, 10) : u.reminderMinute ?? 0;

      // Check if target time falls within the current 5-minute bucket
      // We check if the hour matches AND if the target minute is in [bucket, bucket + 5)
      const hourMatches = currentHour === targetHour;
      const minuteMatches = targetMinute >= currentBucket && targetMinute < currentBucket + 5;

      if (!hourMatches || !minuteMatches) {
        // Debug logging for specific user if needed, or just skip
        // console.log(`Skipping ${u.email}: Now ${currentHour}:${currentMinute} (Bucket ${currentBucket}), Target ${targetHour}:${targetMinute}`);
        continue;
      }

      console.log(`🔔 Sending reminder to ${u.email} (Target: ${targetHour}:${targetMinute}, Now: ${currentHour}:${currentMinute})`);

      const submitted = await prisma.praxisReport.findFirst({
        where: {
          userId: u.id,
          isoWeekKey: currentWeekKey,
          status: { in: ["SUBMITTED", "APPROVED"] },
        },
      });
      if (submitted) {
        console.log(`- Already submitted: ${u.email}`);
        continue;
      }

      const appUrl = process.env.APP_URL || "https://iu-mycampus.me";
      const portalLink = `${appUrl}/praxisbericht2`;
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@iu-portal.com",
        to: u.email,
        subject: "🔔 Erinnerung: Praxisbericht heute noch ausfüllen",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="margin: 0 0 12px;">Hallo ${u.name || "Student"},</h2>
            <p>kurze Erinnerung für heute: Bitte denke daran, deinen Praxisbericht für diese Woche auszufüllen.</p>
            <p>
              <a href="${portalLink}" style="display:inline-block;background:#111827;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:bold;">Praxisbericht öffnen</a>
            </p>
            <p style="color:#999;font-size:12px;">Diese Erinnerung wurde um ${String(targetHour).padStart(2, "0")}:${String(targetMinute).padStart(2, "0")} (${tz}) gesendet.</p>
          </div>
        `,
        text: `Hallo ${u.name || "Student"},\n\nBitte denke daran, deinen Praxisbericht für diese Woche auszufüllen.\n\n${portalLink}\n\nGesendet um ${String(targetHour).padStart(2, "0")}:${String(targetMinute).padStart(2, "0")} (${tz}).`,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        sent++;
        if (emailService === "test") {
          const preview = nodemailer.getTestMessageUrl(info);
          if (preview) previewUrls.push(preview);
          console.log("Preview:", preview);
        }
      } catch (err) {
        console.error(`Failed to send reminder to ${u.email}:`, err);
      }
    }

    console.log("✅ daily-reminders (RR) complete", {
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
      200
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

export default function CronDailyReminders() {
  return null;
}
