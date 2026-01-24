import express, { type Request, type Response } from "express";
import nodemailer from "nodemailer";
import { prisma } from "../utils/db";
import {
  getSessionToken,
  getHourInTimezone,
  getMinuteInTimezone,
} from "../utils/helpers";
import { createTransporter } from "../utils/email";

const router = express.Router();

// Email reminder cron job - sends reminders to students who haven't submitted this week
router.get("/praxisbericht-reminder", async (req: Request, res: Response) => {
  try {
    // Verify cron secret
    const cronSecret = process.env.CRON_SECRET;
    const secret = req.query.secret;
    const isVercelCron = req.get("x-vercel-cron") === "1";

    const requireSecret =
      process.env.NODE_ENV === "production" ? true : !!cronSecret;

    if (
      !isVercelCron &&
      requireSecret &&
      (!cronSecret || secret !== cronSecret)
    ) {
      console.warn("  Unauthorized cron request");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const dryRun = req.query.dryRun === "1";

    // Get current ISO week
    const now = new Date();
    const d = new Date(now.getTime());
    d.setHours(0, 0, 0, 0);
    const day = d.getDay() || 7;
    d.setDate(d.getDate() + 4 - day);
    const isoYear = d.getFullYear();
    const yearStart = new Date(isoYear, 0, 1);
    const week = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 +
        (yearStart.getDay() || 7)) /
        7
    );
    const currentWeekKey = `${isoYear}-W${String(week).padStart(2, "0")}`;

    console.log(` Cron: Checking reminders for week ${currentWeekKey}`);

    // Get all students
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true, email: true, name: true },
    });

    console.log(` Found ${students.length} students`);

    // Find students who haven't submitted for current week
    const submitted = await prisma.practicalReport.findMany({
      where: {
        iso_week_key: currentWeekKey,
        status: { in: ["SUBMITTED", "APPROVED"] },
      },
      select: { user_id: true },
    });

    const submittedIds = new Set(
      submitted.map((r: { user_id: any }) => r.user_id)
    );
    const targets = students.filter(
      (s: { id: unknown }) => !submittedIds.has(s.id)
    );

    console.log(` Targeting ${targets.length} students for reminders`);

    if (dryRun) {
      return res.json({
        success: true,
        dryRun: true,
        currentWeekKey,
        targetCount: targets.length,
        targets: targets.map((t: { email: any }) => t.email),
      });
    }

    // Setup email transporter
    const transporter = await createTransporter();
    
    let sent = 0;
    for (const student of targets) {
      try {
        const appUrl = process.env.APP_URL || "http://localhost:5174";
        const portalLink = `${appUrl}/praxisbericht2`;

        const mailOptions = {
          from: process.env.EMAIL_FROM || "noreply@iu-portal.com",
          to: student.email,
          subject: `Reminder: Submit your Practical Report for Week ${week}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                </style>
              </head>
              <body>
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: #111f60; color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="margin: 0; font-size: 26px;">Reminder</h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 16px;">Submission Due</p>
                  </div>
                  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
                    <p style="font-size: 18px; margin-bottom: 20px;">Hi ${student.name || "Student"},</p>
                    
                    <div style="background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #111f60; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                      <p style="margin: 0; font-size: 16px;">This is a friendly reminder to submit your Practical Report for Week ${week}.</p>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${portalLink}" style="display: inline-block; background: #111f60; color: #ffffff !important; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 10px; font-size: 16px;">Open Praxisberichte</a>
                    </div>
                    
                    <p style="font-size: 14px; color: #999; text-align: center;">
                      Sent on ${new Date().toISOString()}
                    </p>
                  </div>
                  <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-radius: 0 0 10px 10px;">
                    <p>&copy; ${new Date().getFullYear()} IU Student Portal</p>
                    <p style="margin-top: 5px;">This is an automated notification.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
          text: `Hi ${student.name || "Student"},\n\nThis is a reminder to submit your Practical Report for Week ${week}.\n\nVisit: ${portalLink}\n\nBest regards,\nIU Portal Team`,
        };

        await transporter.sendMail(mailOptions);
        console.log(` Email sent to ${student.email}`);
        sent++;
      } catch (err: unknown) {
        let message = "Unknown error";
        if (err && typeof err === "object" && "message" in err) {
          message = String((err as any).message);
        } else if (typeof err === "string") {
          message = err;
        }
        console.error(` Failed to send email to ${student.email}:`, message);
      }
    }

    console.log(` Sent ${sent}/${targets.length} reminder emails`);

    return res.json({
      success: true,
      sent,
      currentWeekKey,
    });
  } catch (error: unknown) {
    console.error(" Error in cron reminder:", error);
    return res.status(500).json({ error: "Failed to send reminders" });
  }
});

// Daily Praxisbericht Reminder Cron
router.get("/daily-reminders", async (req: Request, res: Response) => {
  try {
    console.log(" daily-reminders hit", {
      hour: req.query.hour,
      minute: req.query.minute,
      userId: req.query.userId,
      self: req.query.self,
    });
    const cronSecret = process.env.CRON_SECRET;
    const secret = req.query.secret;
    const isVercelCron = req.get("x-vercel-cron") === "1";
    const requireSecret =
      process.env.NODE_ENV === "production" ? true : !!cronSecret;
    if (
      !isVercelCron &&
      requireSecret &&
      (!cronSecret || secret !== cronSecret)
    ) {
      console.warn(" daily-reminders unauthorized");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Determine target hour (0-23). If provided via query, use it; otherwise compute per user timezone.
    const overrideHour =
      req.query.hour !== undefined
        ? parseInt(String(req.query.hour), 10)
        : null;
    const overrideMinute =
      req.query.minute !== undefined
        ? parseInt(String(req.query.minute), 10)
        : null;
    const overrideWindow =
      req.query.window !== undefined
        ? parseInt(String(req.query.window), 10)
        : null;
    const windowMinutes =
      Number.isFinite(overrideWindow) && overrideWindow! >= 0
        ? overrideWindow!
        : Number.isFinite(Number(process.env.REMINDER_WINDOW_MINUTES))
        ? Number(process.env.REMINDER_WINDOW_MINUTES)
        : 0;
    const debugMode = req.query.debug === "1";
    // const nowUtc = new Date(); // Unused

    const targetUserIdRaw = req.query.userId;
    const selfOnly = req.query.self === "1";

    let users: any[];
    if (selfOnly) {
      const token = getSessionToken(req);
      if (!token) return res.status(401).json({ error: "Unauthorized" });
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });
      if (!session?.user || !session.user.reminder_enabled) {
        return res.json({ success: true, sent: 0, usersChecked: 0 });
      }
      users = [
        {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          reminder_hour: session.user.reminder_hour,
          reminder_minute: session.user.reminder_minute,
          reminder_timezone: session.user.reminder_timezone,
          role: session.user.role,
        },
      ];
    } else if (targetUserIdRaw) {
      console.log(" daily-reminders targeting userId", targetUserIdRaw);
      const user = await prisma.user.findUnique({
        where: { id: Number(targetUserIdRaw) || -1 },
        select: {
          id: true,
          email: true,
          name: true,
          reminder_hour: true,
          reminder_minute: true,
          reminder_timezone: true,
          role: true,
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
                reminder_hour: user.reminder_hour,
                reminder_minute: user.reminder_minute,
                reminder_timezone: user.reminder_timezone,
                role: user.role,
              },
            ]
          : [];
    } else {
      // Fetch all users who enabled reminders. We'll filter per-hour below if not overriding.
      users = await prisma.user.findMany({
        where: { reminder_enabled: true },
        select: {
          id: true,
          email: true,
          name: true,
          reminder_hour: true,
          reminder_minute: true,
          reminder_timezone: true,
          role: true,
        },
      });
    }

    console.log(" daily-reminders users loaded", users.length);

    // Get current ISO week key util (same as used elsewhere)
    const now = new Date();
    const d = new Date(now.getTime());
    d.setHours(0, 0, 0, 0);
    const day = d.getDay() || 7;
    d.setDate(d.getDate() + 4 - day);
    const isoYear = d.getFullYear();
    const yearStart = new Date(isoYear, 0, 1);
    const week = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 +
        (yearStart.getDay() || 7)) /
        7
    );
    const currentWeekKey = `${isoYear}-W${String(week).padStart(2, "0")}`;

    let sent = 0;
    
    // Use reusable transporter
    const transporter = await createTransporter();

    // Check which users are due and haven't submitted this week
    const userDebug: Array<Record<string, unknown>> = [];
    for (const u of users) {
      const tz = u.reminder_timezone || "Europe/Berlin";
      const currentHour = getHourInTimezone(tz);
      const currentMinute = getMinuteInTimezone(tz);
      const targetHour = overrideHour ?? u.reminder_hour ?? 18;
      const targetMinute = overrideMinute ?? u.reminder_minute ?? 0;
      const currentTotal = currentHour * 60 + currentMinute;
      const targetTotal = targetHour * 60 + targetMinute;
      const diffForward = (currentTotal - targetTotal + 1440) % 1440;
      const diffBackward = (targetTotal - currentTotal + 1440) % 1440;
      const minuteDistance = Math.min(diffForward, diffBackward);
      if (minuteDistance > windowMinutes) {
        userDebug.push({
          userId: u.id,
          email: u.email,
          tz,
          currentHour,
          currentMinute,
          targetHour,
          targetMinute,
          windowMinutes,
          minuteDistance,
          reason: "time-mismatch",
        });
        continue;
      }

      // Has user submitted this week?
      const submitted = await prisma.practicalReport.findFirst({
        where: {
          user_id: u.id,
          iso_week_key: currentWeekKey,
          status: { in: ["SUBMITTED", "APPROVED"] },
        },
      });
      if (submitted) {
        userDebug.push({
          userId: u.id,
          email: u.email,
          tz,
          currentHour,
          currentMinute,
          targetHour,
          targetMinute,
          windowMinutes,
          minuteDistance: 0,
          reason: "already-submitted",
        });
        continue;
      }

      // Send reminder email
      const appUrl = process.env.APP_URL || "https://iu-mycampus.me";
      const portalLink = `${appUrl}/praxisbericht2`;
      const mailOptions = {
        from:
          process.env.EMAIL_FROM ||
          process.env.EMAIL_USER ||
          "noreply@iu-portal.com",
        to: u.email,
        subject: " Erinnerung: Praxisbericht heute noch ausfüllen",
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
        await transporter.sendMail(mailOptions);
        sent++;
        userDebug.push({
          userId: u.id,
          email: u.email,
          tz,
          currentHour,
          currentMinute,
          targetHour,
          targetMinute,
          reason: "sent",
        });
      } catch (err: unknown) {
        let message = "Unknown error";
        if (err && typeof err === "object" && "message" in err) {
          message = String((err as any).message);
        } else if (typeof err === "string") {
          message = err;
        }
        console.error(`Failed to send reminder to ${u.email}:`, message);
      }
    }

    const summary: Record<string, unknown> = {
      sent,
      usersChecked: users.length,
    };
    if (debugMode) summary["userDebug"] = userDebug;

    console.log(" daily-reminders complete", summary);
    return res.json({
      success: true,
      sent,
      usersChecked: users.length,
      ...(debugMode ? { userDebug } : {}),
    });
  } catch (error) {
    console.error("/api/cron/daily-reminders error", error);
    return res.status(500).json({ error: "Failed to run daily reminders" });
  }
});

export default router;
