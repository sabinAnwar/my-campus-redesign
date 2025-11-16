import { prisma } from "../../../lib/prisma";
import nodemailer from "nodemailer";

function getHourInTimezone(tz) {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hour12: false,
      timeZone: tz || "Europe/Berlin",
    });
    const parts = fmt.formatToParts(new Date());
    const hourStr = parts.find((p) => p.type === "hour")?.value || "00";
    return Number(hourStr);
  } catch (_) {
    return new Date().getUTCHours();
  }
}

function getMinuteInTimezone(tz) {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      minute: "2-digit",
      hour12: false,
      timeZone: tz || "Europe/Berlin",
    });
    const parts = fmt.formatToParts(new Date());
    const minStr = parts.find((p) => p.type === "minute")?.value || "00";
    return Number(minStr);
  } catch (_) {
    return new Date().getUTCMinutes();
  }
}

function getCurrentWeekKey() {
  const now = new Date();
  const d = new Date(now.getTime());
  d.setHours(0, 0, 0, 0);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - day);
  const isoYear = d.getFullYear();
  const yearStart = new Date(isoYear, 0, 1);
  const week = Math.ceil(((d - yearStart) / 86400000 + (yearStart.getDay() || 7)) / 7);
  return `${isoYear}-W${String(week).padStart(2, "0")}`;
}

export async function loader({ request }) {
  try {
    const url = new URL(request.url);
    const secret = url.searchParams.get("secret");
    const isVercelCron = request.headers.get("x-vercel-cron") === "1";
    const overrideHourRaw = url.searchParams.get("hour");
    const overrideMinuteRaw = url.searchParams.get("minute");

    const cronSecret = process.env.CRON_SECRET;
    if (!isVercelCron && (!cronSecret || secret !== cronSecret)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const overrideHour =
      overrideHourRaw != null ? parseInt(String(overrideHourRaw), 10) : null;
    const overrideMinute =
      overrideMinuteRaw != null
        ? parseInt(String(overrideMinuteRaw), 10)
        : null;

    // Try selecting reminderMinute; if the Prisma client is outdated, retry without it
    let users;
    let noMinuteInClient = false;
    try {
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
    } catch (e) {
      const msg = e?.message || "";
      if (
        msg.includes("Unknown field `reminderMinute`") ||
        msg.includes("Unknown arg `reminderMinute`")
      ) {
        noMinuteInClient = true;
        users = await prisma.user.findMany({
          where: { reminderEnabled: true },
          select: {
            id: true,
            email: true,
            name: true,
            reminderHour: true,
            reminderTimezone: true,
          },
        });
        // Normalize to include reminderMinute: 0 when client doesn't support it
        users = users.map((u) => ({ ...u, reminderMinute: 0 }));
      } else {
        throw e;
      }
    }

    const currentWeekKey = getCurrentWeekKey();

    const emailService = process.env.EMAIL_SERVICE || "test";
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

    let sent = 0;
    for (const u of users) {
      const tz = u.reminderTimezone || "Europe/Berlin";
      const currentHour = getHourInTimezone(tz);
      const currentMinute = getMinuteInTimezone(tz);
      const targetHour = overrideHour ?? u.reminderHour ?? 18;
      const targetMinute = overrideMinute ?? u.reminderMinute ?? 0;
      if (currentHour !== targetHour || currentMinute !== targetMinute)
        continue;

      const submitted = await prisma.praxisReport.findFirst({
        where: {
          userId: u.id,
          isoWeekKey: currentWeekKey,
          status: { in: ["SUBMITTED", "APPROVED"] },
        },
      });
      if (submitted) continue;

      const appUrl = process.env.APP_URL || "http://localhost:5173";
      const portalLink = `${appUrl}/praxisbericht`;

      const mailOptions = {
        from:
          process.env.EMAIL_FROM ||
          process.env.EMAIL_USER ||
          "noreply@iu-portal.com",
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
          console.log("Preview:", nodemailer.getTestMessageUrl(info));
        }
      } catch (err) {
        console.error(`Failed to send reminder to ${u.email}:`, err.message);
      }
    }

    return Response.json({ success: true, sent, usersChecked: users.length });
  } catch (error) {
    console.error("/api/cron/daily-reminders loader error", error);
    return Response.json({ error: "Failed to run daily reminders" }, { status: 500 });
  }
}

export default function DailyRemindersApiRoute() {
  return null;
}
