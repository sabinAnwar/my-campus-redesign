import express, {
  type Request,
  type Response,
  type NextFunction,
  type CookieOptions,
} from "express";
import cookieParser from "cookie-parser";
import { createRequestHandler } from "@react-router/express";
// @ts-ignore - generated server build has no TypeScript types
import * as serverBuild from "../build/server/nodejs_eyJydW50aW1lIjoibm9kZWpzIn0/index.js";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, "../build/client");

const prisma = new PrismaClient();
const app = express();

// Ensure Express knows it's behind a proxy (Vercel) so secure cookies work correctly
app.set("trust proxy", 1);

// Middleware
// IMPORTANT: Do NOT use global body parsers before React Router's handler.
// They will consume the request stream and break RR actions/loaders (e.g., /api/*.data POST bodies).
// Use cookie parser globally (safe), and attach body parsers only to specific Express endpoints below.
app.use(cookieParser()); // Populate req.cookies for auth/session

// Catch special browser/devtools requests BEFORE React Router
app.use((req: Request, res: Response, next: NextFunction) => {
  // Handle /.well-known/* requests
  if (req.path.startsWith("/.well-known/")) {
    return res.status(404).json({ error: "Not found" });
  }
  // Handle other special files
  if (
    req.path === "/robots.txt" ||
    req.path === "/sitemap.xml" ||
    req.path.includes("devtools") ||
    req.path.includes(".json")
  ) {
    return res.status(404).json({ error: "Not found" });
  }
  next();
});

// Ignore browser requests for special files
app.get("/.well-known/appspecific/:filename", (req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.get("/robots.txt", (req: Request, res: Response) => {
  res.type("text/plain").send("User-agent: *\nDisallow: /admin\n");
});

app.get("/sitemap.xml", (req: Request, res: Response) => {
  res
    .type("text/xml")
    .send(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
    );
});

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => res.json({ ok: true }));

// Small helper: get session token from cookie or header, accept both legacy and new names
function getSessionToken(req: Request): string | null {
  const cookieToken =
    req.cookies?.session || req.cookies?.auth_session || null;
  const headerToken = req.get("X-Session-Token") || req.get("x-session-token") || null;
  return cookieToken || headerToken || null;
}

// Get current hour in a specific IANA timezone (0-23)
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
  } catch (_) {
    return new Date().getUTCHours();
  }
}

// Get current minute in a specific IANA timezone (0-59)
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
  } catch (_) {
    return new Date().getUTCMinutes();
  }
}

function getCookieOptions(req: Request): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  let domain;
  try {
    // Priority 1: explicit override
    if (process.env.COOKIE_DOMAIN) {
      const d = process.env.COOKIE_DOMAIN.trim();
      if (d.toLowerCase() === "host-only") {
        domain = undefined; // force host-only cookie
      } else {
        domain = d.startsWith(".") ? d : `.${d}`;
      }
    } else if (process.env.DISABLE_COOKIE_DOMAIN === "1") {
      domain = undefined;
    } else if (process.env.APP_URL) {
      const u = new URL(process.env.APP_URL);
      domain = u.hostname === "localhost" ? undefined : `.${u.hostname}`;
    }
  } catch (_) {
    domain = undefined;
  }
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    domain,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

// Login endpoints are handled by React Router actions (app/routes/api/login.jsx)
// Do NOT define Express handlers for /api/login or /api/login.data here,
// so createRequestHandler can process them and perform 303 redirects.

// Simple current user endpoint (used by dashboard)
app.get("/api/user", async (req: Request, res: Response) => {
  try {
    console.log("🔎 /api/user headers", {
      cookie: req.headers?.cookie || null,
      xSession:
        req.get("x-session-token") || req.get("X-Session-Token") || null,
    });
    const token = getSessionToken(req);
    console.log("🔑 /api/user resolved token", token);
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
    console.log(
      "🗄️ /api/user session lookup",
      !!session,
      session?.user ? "has-user" : "no-user"
    );
    if (!session || !session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    // Derive campus/location info (placeholder until real data available)
    // In the future, replace with actual user campus fields from DB or an external API
    const campusCity = process.env.DEFAULT_CAMPUS_CITY || "Hamburg";
    const campusArea = process.env.DEFAULT_CAMPUS_AREA || "Hammerbrook";
    const roomBookingEnabled = process.env.ROOM_BOOKING_ENABLED !== "0"; // default true

    return res.json({
      user: {
        id: session.user.id,
        name: session.user.name || "Student",
        email: session.user.email,
        campusCity,
        campusArea,
        roomBookingEnabled,
      },
    });
  } catch (err: unknown) {
    console.error("/api/user error", err);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Logout endpoint (support .data too)
async function handleLogout(req: Request, res: Response) {
  try {
    const token = getSessionToken(req);
    if (token) {
      await prisma.session.deleteMany({ where: { token } });
    }
    res.cookie("session", "", { ...getCookieOptions(req), maxAge: 0 });
    return res.json({ success: true });
  } catch (err: unknown) {
    console.error("/api/logout error", err);
    return res.status(500).json({ error: "Failed to logout" });
  }
}
app.post("/api/logout", handleLogout);
app.post("/api/logout.data", handleLogout);

// Password reset request endpoint
app.post(
  "/api/request-password-reset",
  // Accept either application/json or x-www-form-urlencoded
  express.json(),
  express.urlencoded({ extended: true }),
  async (req, res) => {
  try {
    const { email } = req.body;

    console.log("📝 Password reset request for:", email);
    console.log("   req.body:", req.body);
    console.log("   Content-Type:", req.headers["content-type"]);

    if (!email || typeof email !== "string") {
      console.log("❌ Invalid email:", { email, type: typeof email });
      return res
        .status(400)
        .json({ error: "Please provide a valid email address" });
    }

    console.log("🔍 Looking up user with email:", email.toLowerCase());

    // Find user by email (case-insensitive)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    console.log("👤 User found:", user ? user.email : "none");

    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      console.log("⚠️  No user found for email:", email);
      return res.json({
        success: true,
        message:
          "If an account exists with this email, you will receive a password reset link shortly.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomUUID();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    console.log("🔐 Generated reset token, updating user...");

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    console.log("📧 Sending password reset email...");

    // Send email
    const resetLink = `${process.env.APP_URL || "https://iu-mycampus.me"}/reset-password/${resetToken}`;

    const emailResponse = await sendPasswordResetEmail(email, resetLink);

    console.log("✅ Password reset email sent to:", email);

    return res.json({
      success: true,
      message:
        "If an account exists with this email, you will receive a password reset link shortly.",
      // In development, return the link for testing
      ...(process.env.NODE_ENV === "development" && { resetLink, resetToken }),
    });
  } catch (error: unknown) {
    let message = "Unknown error";
    let stack: string | undefined;
    if (error instanceof Error) {
      message = error.message;
      stack = error.stack;
    } else if (typeof error === "string") {
      message = error;
    }
    console.error("❌ Error requesting password reset:", message);
    if (stack) {
      console.error("   Error stack:", stack);
    }
    return res.status(500).json({
      error: "Failed to process password reset request",
      details: message,
    });
  }
  }
);

async function sendPasswordResetEmail(email: string, resetLink: string) {
  try {
    let transporter;

    if (process.env.EMAIL_SERVICE === "gmail") {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else if (process.env.EMAIL_SERVICE === "sendgrid") {
      transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
          user: "apikey",
          pass: process.env.SENDGRID_API_KEY,
        },
      });
    } else {
      // Development mode - use Ethereal Email
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@iu-portal.com",
      to: email,
      subject: "IU Portal - Password Reset Request",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #000; margin: 0;">
                  <span style="display: inline-block; background: #000; color: white; width: 40px; height: 40px; border-radius: 50%; line-height: 40px; font-size: 20px; font-weight: bold;">IU</span>
                </h1>
                <p style="color: #666; margin-top: 10px;">IU Student Portal</p>
              </div>

              <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
              
              <p>Hello,</p>
              
              <p>We received a request to reset the password for your IU student account. If you didn't make this request, you can safely ignore this email.</p>
              
              <p>To reset your password, click the button below. This link will expire in 1 hour.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="display: inline-block; background: #000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                  Reset Your Password
                </a>
              </div>
              
              <p style="color: #666; font-size: 12px;">Or copy this link: <a href="${resetLink}" style="color: #0066cc;">${resetLink}</a></p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              
              <p style="color: #666; font-size: 12px;">
                If you have any questions, please contact our support team at support@iu-portal.com
              </p>
              
              <p style="color: #666; font-size: 12px;">
                Best regards,<br>
                IU Portal Team
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
        Password Reset Request
        
        Hello,
        
        We received a request to reset the password for your IU student account.
        
        To reset your password, visit this link:
        ${resetLink}
        
        This link will expire in 1 hour.
        
        If you didn't make this request, you can safely ignore this email.
        
        Best regards,
        IU Portal Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return true;
  } catch (error: unknown) {
    console.log("Error sending password reset email:", error);
    return false;
  }
}

// Verify password reset token endpoint
app.post(
  "/api/verify-reset-token",
  express.json(),
  express.urlencoded({ extended: true }),
  async (req, res) => {
  try {
    const { token } = req.body;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ error: "Invalid token" });
    }

    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    return res.json({ success: true, valid: true });
  } catch (error: unknown) {
    console.error("❌ Error verifying reset token:", error);
    return res.status(500).json({ error: "Failed to verify token" });
  }
  }
);

// Reset password endpoint
app.post(
  "/api/reset-password",
  express.json(),
  express.urlencoded({ extended: true }),
  async (req, res) => {
  try {
    const { token, password } = req.body;

    console.log(
      "📝 Password reset attempt with token:",
      token?.substring(0, 8) + "..."
    );

    if (!token || typeof token !== "string") {
      return res.status(400).json({ error: "Invalid token" });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Please provide a new password" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    console.log("✅ Password reset successfully for user:", user.email);

    return res.json({
      success: true,
      message: "Password reset successfully!",
    });
  } catch (error: unknown) {
    console.error("❌ Error resetting password:", error);
    return res.status(500).json({ error: "Failed to reset password" });
  }
  }
);

// Email reminder cron job - sends reminders to students who haven't submitted this week
app.get("/api/cron/praxisbericht-reminder", async (req, res) => {
  try {
    // Verify cron secret
    const cronSecret = process.env.CRON_SECRET;
    const secret = req.query.secret;
    const isVercelCron = req.get("x-vercel-cron") === "1";

    const requireSecret =
      process.env.NODE_ENV === "production" ? true : !!cronSecret;

    if (!isVercelCron && requireSecret && (!cronSecret || secret !== cronSecret)) {
      console.warn("⚠️  Unauthorized cron request");
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

    console.log(`📧 Cron: Checking reminders for week ${currentWeekKey}`);

    // Get all students
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      select: { id: true, email: true, name: true },
    });

    console.log(`👥 Found ${students.length} students`);

    // Find students who haven't submitted for current week
    const submitted = await prisma.praxisReport.findMany({
      where: {
        isoWeekKey: currentWeekKey,
        status: { in: ["SUBMITTED", "APPROVED"] },
      },
      select: { userId: true },
    });

    const submittedIds = new Set(submitted.map((r: { userId: any; }) => r.userId));
    const targets = students.filter((s: { id: unknown; }) => !submittedIds.has(s.id));

    console.log(`📬 Targeting ${targets.length} students for reminders`);

    if (dryRun) {
      return res.json({
        success: true,
        dryRun: true,
        currentWeekKey,
        targetCount: targets.length,
        targets: targets.map((t: { email: any; }) => t.email),
      });
    }

    // Setup email transporter
    const emailService = process.env.EMAIL_SERVICE || "test";
    let transporter;

    if (emailService === "gmail") {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else if (emailService === "sendgrid") {
      transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
          user: "apikey",
          pass: process.env.SENDGRID_API_KEY,
        },
      });
    } else {
      // Test mode - create test account
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    let sent = 0;
    for (const student of targets) {
      try {
        const appUrl = process.env.APP_URL || "http://localhost:5174";
        const portalLink = `${appUrl}/praxisbericht2`;

        const mailOptions = {
          from: process.env.EMAIL_FROM || "noreply@iu-portal.com",
          to: student.email,
          subject: `📝 Reminder: Submit your Practical Report for Week ${week}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="margin: 0 0 12px;">Hi ${student.name || "Student"},</h2>
              
              <p>This is a friendly reminder to submit your Practical Report for the current week.</p>
              
              <p>You can submit it from the portal:</p>
              
              <p>
                <a href="${portalLink}" style="display: inline-block; background: #111827; color: #fff; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                  Open Praxisberichte
                </a>
              </p>
              
              <p style="color: #999; font-size: 12px;">
                Sent on ${new Date().toISOString()}
              </p>
            </div>
          `,
          text: `Hi ${student.name || "Student"},\n\nThis is a reminder to submit your Practical Report for Week ${week}.\n\nVisit: ${portalLink}\n\nBest regards,\nIU Portal Team`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(
          `✅ Email sent to ${student.email}`,
          emailService === "test"
            ? `Preview: ${nodemailer.getTestMessageUrl(info)}`
            : ""
        );
        sent++;
      } catch (err: unknown) {
        let message = "Unknown error";
        if (err && typeof err === "object" && "message" in err) {
          message = String((err as any).message);
        } else if (typeof err === "string") {
          message = err;
        }
        console.error(
          `❌ Failed to send email to ${student.email}:`,
          message
        );
      }
    }

    console.log(`📊 Sent ${sent}/${targets.length} reminder emails`);

    return res.json({
      success: true,
      sent,
      currentWeekKey,
    });
  } catch (error: unknown) {
    console.error("❌ Error in cron reminder:", error);
    return res.status(500).json({ error: "Failed to send reminders" });
  }
});

// Praxisbericht endpoints
app.get("/api/praxisberichte", async (req, res) => {
  try {
    const sessionToken = getSessionToken(req);
    if (!sessionToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get all praxisbericht reports for this user
    const reports = await prisma.praxisReport.findMany({
      where: { userId: session.user.id },
      orderBy: { isoWeekKey: "asc" },
    });

    return res.json({ reports });
  } catch (error: unknown) {
    console.error("❌ Error fetching praxisberichte:", error);
    return res.status(500).json({ error: "Failed to fetch reports" });
  }
});

app.put("/api/praxisberichte/:weekKey", express.json(), async (req, res) => {
  try {
    const sessionToken = getSessionToken(req);
    if (!sessionToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { weekKey } = req.params;
    const { days, tasks, grade, status } = req.body;

    if (!tasks || tasks.length < 10) {
      return res
        .status(400)
        .json({ error: "Tasks must be at least 10 characters" });
    }

    const report = await prisma.praxisReport.upsert({
      where: {
        isoWeekKey_userId: {
          isoWeekKey: weekKey,
          userId: session.user.id,
        },
      },
      create: {
        isoWeekKey: weekKey,
        userId: session.user.id,
        days: days || {},
        tasks,
        grade: grade || 0,
        status: (status || "DUE").toUpperCase(),
        editedAt: new Date(),
      },
      update: {
        days: days || {},
        tasks,
        grade: grade || 0,
        status: (status || "DUE").toUpperCase(),
        editedAt: new Date(),
      },
    });

    return res.json(report);
  } catch (error: unknown) {
    console.error("❌ Error updating praxisbericht:", error);
    return res.status(500).json({ error: "Failed to update report" });
  }
});

// ---------------------------------
// Reminder Preferences API (per user)
// ---------------------------------
app.get("/api/reminders/preferences", async (req, res) => {
  try {
    const token = getSessionToken(req);
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!session?.user) return res.status(401).json({ error: "Unauthorized" });
    const { reminderEnabled, reminderHour, reminderMinute, reminderTimezone } =
      session.user;
    return res.json({
      reminderEnabled: !!reminderEnabled,
      reminderHour: reminderHour ?? 18,
      reminderMinute: reminderMinute ?? 0,
      reminderTimezone: reminderTimezone || "Europe/Berlin",
    });
  } catch (err: unknown) {
    console.error("/api/reminders/preferences GET error", err);
    return res.status(500).json({ error: "Failed to load preferences" });
  }
});

app.post(
  "/api/reminders/preferences",
  express.json(),
  express.urlencoded({ extended: true }),
  async (req, res) => {
    try {
      const token = getSessionToken(req);
      if (!token) return res.status(401).json({ error: "Unauthorized" });
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });
      if (!session?.user)
        return res.status(401).json({ error: "Unauthorized" });

      const enabledRaw = (
        req.body.enabled ??
        req.body.reminderEnabled ??
        "false"
      ).toString();
      const hourRaw = (
        req.body.hour ??
        req.body.reminderHour ??
        "18"
      ).toString();
      const minuteRaw = (
        req.body.minute ??
        req.body.reminderMinute ??
        "0"
      ).toString();
      const tzCandidate =
        req.body.timezone ??
        req.body.reminderTimezone ??
        session.user.reminderTimezone;
      const tzRaw = (tzCandidate || "Europe/Berlin").toString();

      const enabled =
        enabledRaw === "true" || enabledRaw === "1" || enabledRaw === "on";
      let hour = parseInt(hourRaw, 10);
      if (hour === 24) hour = 0; // map 24:00 to 00:00
      if (!Number.isFinite(hour) || hour < 0 || hour > 23) hour = 18;
      let minute = parseInt(minuteRaw, 10);
      if (!Number.isFinite(minute) || minute < 0 || minute > 59) minute = 0;

      // Try save with minute; if unsupported (older client/DB), retry without it
      const data = {
        reminderEnabled: enabled,
        reminderHour: hour,
        reminderTimezone: tzRaw,
      };
      let savedMinute: number | null = minute;
      try {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { ...data, reminderMinute: minute },
        });
      } catch (e: unknown) {
        let msg = "";
        if (e && typeof e === "object" && "message" in e) {
          msg = String((e as any).message);
        } else if (typeof e === "string") {
          msg = e;
        }
        const minuteUnsupported =
          msg.includes("Unknown arg `reminderMinute`") ||
          msg.includes('column "reminderMinute"');
        if (!minuteUnsupported) throw e;
        await prisma.user.update({ where: { id: session.user.id }, data });
        savedMinute = null;
      }

      return res.json({
        success: true,
        reminderEnabled: enabled,
        reminderHour: hour,
        reminderMinute: savedMinute,
        reminderTimezone: tzRaw,
      });
    } catch (err: unknown) {
      console.error("/api/reminders/preferences POST error", err);
      return res.status(500).json({ error: "Failed to save preferences" });
    }
  }
);

// -----------------------------
// News API (public)
// -----------------------------
// IMPORTANT: Must be registered BEFORE the React Router handler below.

// Helper to safely parse ints with default
function toInt(value: unknown, def: number): number {
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) && n > 0 ? n : def;
}

app.get("/api/news", async (req, res) => {
  const page = toInt(req.query.page, 1);
  const pageSize = Math.min(toInt(req.query.pageSize, 12), 50);
  const search = (req.query.search || "").toString().trim();
  const category = (req.query.category || "").toString().trim();
  const tag = (req.query.tag || "").toString().trim();
  const skip = (page - 1) * pageSize;

  try {
    const where = {
      status: "PUBLISHED",
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                excerpt: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                content: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
      ...(category
        ? {
            category: {
              equals: category,
              mode: "insensitive",
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where: where as any,
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        take: pageSize,
        skip,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          category: true,
          tags: true,
          author: true,
          coverImageUrl: true,
          featured: true,
          publishedAt: true,
        },
      }),
      prisma.news.count({ where: where as any }),
    ]);

    // optional tag filter on result set (tags stored as JSON string)
    const filtered = tag
      ? items.filter((n: { tags: any; }) => {
          try {
            const arr = JSON.parse(n.tags || "[]");
            return (
              Array.isArray(arr) &&
              arr.some((t) => String(t).toLowerCase() === tag.toLowerCase())
            );
          } catch (_) {
            return false;
          }
        })
      : items;

    return res.json({ items: filtered, total, page, pageSize });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err && typeof err === "object" && "message" in err) {
      message = String((err as any).message);
    } else if (typeof err === "string") {
      message = err;
    }
    console.warn("/api/news fallback due to error:", message);
    // Fallback: multiple static samples when DB not migrated, with filtering + pagination
    const now = new Date();
    const daysAgo = (d: number) => {
      const t = new Date(now);
      t.setDate(now.getDate() - d);
      return t.toISOString();
    };
    const all: Array<{
      id: number;
      slug: string;
      title: string;
      excerpt: string;
      content: string;
      category: string;
      tags: string;
      author: string;
      coverImageUrl?: string;
      featured: boolean;
      publishedAt: string;
    }> = [
      {
        id: 7,
        slug: "career-fair-2025",
        title: "Join the 2025 Career Fair",
        excerpt: "Meet employers, attend workshops, and grow your network.",
        content: "Career fair details",
        category: "Careers",
        tags: JSON.stringify(["career", "fair", "jobs"]),
        author: "Career Services",
        coverImageUrl: undefined,
        featured: true,
        publishedAt: daysAgo(0),
      },
      {
        id: 4,
        slug: "new-module-data-analytics",
        title: "New Module: Data Analytics with Python",
        excerpt:
          "Enroll now for the upcoming semester to learn modern analytics.",
        content: "Module details",
        category: "Academics",
        tags: JSON.stringify(["module", "python", "analytics"]),
        author: "Faculty of Computer Science",
        coverImageUrl: undefined,
        featured: true,
        publishedAt: daysAgo(2),
      },
      {
        id: 1,
        slug: "welcome-to-the-portal",
        title: "Welcome to the IU Student Portal",
        excerpt:
          "Everything you need in one place: marks, applications, modules, and more.",
        content: "Welcome content",
        category: "Announcements",
        tags: JSON.stringify(["announcement", "portal"]),
        author: "IU Team",
        coverImageUrl: undefined,
        featured: false,
        publishedAt: daysAgo(3),
      },
      {
        id: 2,
        slug: "exam-schedule-winter",
        title: "Winter Exam Schedule Published",
        excerpt:
          "Check the dates and registration deadlines for the winter term.",
        content: "Exam schedule details",
        category: "Exams",
        tags: JSON.stringify(["exams", "schedule"]),
        author: "Examination Office",
        coverImageUrl: undefined,
        featured: false,
        publishedAt: daysAgo(4),
      },
      {
        id: 3,
        slug: "campus-maintenance-november",
        title: "Scheduled Campus Maintenance in November",
        excerpt: "Short downtimes may occur on selected services next weekend.",
        content: "Maintenance details",
        category: "IT",
        tags: JSON.stringify(["maintenance", "it"]),
        author: "IT Services",
        coverImageUrl: undefined,
        featured: false,
        publishedAt: daysAgo(5),
      },
      {
        id: 5,
        slug: "scholarship-opportunities-2025",
        title: "Scholarship Opportunities 2025",
        excerpt:
          "Multiple scholarships for outstanding students now available.",
        content: "Scholarship details",
        category: "Scholarships",
        tags: JSON.stringify(["scholarship", "finance"]),
        author: "Student Office",
        coverImageUrl: undefined,
        featured: false,
        publishedAt: daysAgo(7),
      },
      {
        id: 6,
        slug: "library-extended-hours",
        title: "Library Extends Opening Hours",
        excerpt: "From next month, the library will be open until midnight.",
        content: "Library details",
        category: "Library",
        tags: JSON.stringify(["library", "hours"]),
        author: "Library Team",
        coverImageUrl: undefined,
        featured: false,
        publishedAt: daysAgo(9),
      },
    ];
    const q = (search || "").toLowerCase();
    let filtered = all;
    if (q) {
      filtered = filtered.filter((n) =>
        [n.title, n.excerpt, n.content].some((t) =>
          (t || "").toLowerCase().includes(q)
        )
      );
    }
    if (category) {
      filtered = filtered.filter(
        (n) => (n.category || "").toLowerCase() === category.toLowerCase()
      );
    }
    if (tag) {
      filtered = filtered.filter((n) => {
        try {
          const arr = JSON.parse(n.tags || "[]");
          return (
            Array.isArray(arr) &&
            arr.some((t) => String(t).toLowerCase() === tag.toLowerCase())
          );
        } catch {
          return false;
        }
      });
    }
    // Sort featured first, then by publishedAt desc
    filtered = filtered.sort((a, b) => {
      if (a.featured === b.featured) {
        return (
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
        );
      }
      return a.featured ? -1 : 1;
    });
    const total = filtered.length;
    const items = filtered
      .slice(skip, skip + pageSize)
      .map(({ content, ...rest }) => rest);
    return res.json({ items, total, page, pageSize });
  }
});

// ---------------------------------
// Daily Praxisbericht Reminder Cron
// ---------------------------------
app.get("/api/cron/daily-reminders", async (req, res) => {
  try {
    console.log("🚦 daily-reminders hit", {
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
      console.warn("⚠️ daily-reminders unauthorized");
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
    const nowUtc = new Date();

    const targetUserIdRaw = req.query.userId;
    const selfOnly = req.query.self === "1";

    let users;
    if (selfOnly) {
      const token = getSessionToken(req);
      if (!token) return res.status(401).json({ error: "Unauthorized" });
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });
      if (!session?.user || !session.user.reminderEnabled) {
        return res.json({ success: true, sent: 0, usersChecked: 0 });
      }
      users = [
        {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          reminderHour: session.user.reminderHour,
          reminderMinute: session.user.reminderMinute,
          reminderTimezone: session.user.reminderTimezone,
          role: session.user.role,
        },
      ];
    } else if (targetUserIdRaw) {
      console.log("🔎 daily-reminders targeting userId", targetUserIdRaw);
      const user = await prisma.user.findUnique({
        where: { id: Number(targetUserIdRaw) || -1 },
        select: {
          id: true,
          email: true,
          name: true,
          reminderHour: true,
          reminderMinute: true,
          reminderTimezone: true,
          role: true,
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
                role: user.role,
              },
            ]
          : [];
    } else {
      // Fetch all users who enabled reminders. We'll filter per-hour below if not overriding.
      users = await prisma.user.findMany({
        where: { reminderEnabled: true },
        select: {
          id: true,
          email: true,
          name: true,
          reminderHour: true,
          reminderMinute: true,
          reminderTimezone: true,
          role: true,
        },
      });
    }

    console.log("👥 daily-reminders users loaded", users.length);

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
    const emailService = process.env.EMAIL_SERVICE || "test";
    const previewUrls: string[] = [];
    let transporter;
    if (emailService === "gmail") {
      // Use Gmail SMTP with App Password (recommended). Requires 2FA + App Password on the account.
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

    // Check which users are due and haven't submitted this week
    for (const u of users) {
      const tz = u.reminderTimezone || "Europe/Berlin";
      const currentHour = getHourInTimezone(tz);
      const currentMinute = getMinuteInTimezone(tz);
      const targetHour = overrideHour ?? u.reminderHour ?? 18;
      const targetMinute = overrideMinute ?? u.reminderMinute ?? 0;
      if (currentHour !== targetHour || currentMinute !== targetMinute)
        continue;

      // Has user submitted this week?
      const submitted = await prisma.praxisReport.findFirst({
        where: {
          userId: u.id,
          isoWeekKey: currentWeekKey,
          status: { in: ["SUBMITTED", "APPROVED"] },
        },
      });
      if (submitted) continue;

      // Send reminder email
      const appUrl = process.env.APP_URL || "https://iu-mycampus.me";
      const portalLink = `${appUrl}/praxisbericht2`;
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
          const preview = nodemailer.getTestMessageUrl(info);
          if (preview) previewUrls.push(preview);
          console.log("Preview:", preview);
        }
      } catch (err: unknown) {
        let message = "Unknown error";
        if (err && typeof err === "object" && "message" in err) {
          message = String((err as any).message);
        } else if (typeof err === "string") {
          message = err;
        }
        console.error(
          `Failed to send reminder to ${u.email}:`,
          message
        );
      }
    }

    console.log("✅ daily-reminders complete", {
      sent,
      usersChecked: users.length,
      previews: previewUrls.length,
    });
    return res.json({
      success: true,
      sent,
      usersChecked: users.length,
      ...(previewUrls.length > 0 ? { previews: previewUrls } : {}),
    });
  } catch (error) {
    console.error("/api/cron/daily-reminders error", error);
    return res.status(500).json({ error: "Failed to run daily reminders" });
  }
});

app.get("/api/news/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    let item = await prisma.news.findUnique({ where: { slug } });
    if (!item && /^\d+$/.test(slug)) {
      item = await prisma.news.findUnique({ where: { id: Number(slug) } });
    }
    if (!item) {
      return res.status(404).json({ error: "News not found" });
    }
    return res.json({ item });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err && typeof err === "object" && "message" in err) {
      message = String((err as any).message);
    } else if (typeof err === "string") {
      message = err;
    }
    console.warn("/api/news/:slug fallback due to error:", message);
    const now = new Date().toISOString();
    const samples = [
      { id: 1, slug: "welcome-to-the-portal", title: "Welcome to the IU Student Portal", content: "We are excited to launch the new IU Student Portal. Here you can manage your marks, upload your practical reports, and stay informed about the latest campus updates.", category: "Announcements", tags: JSON.stringify(["announcement","portal"]), author: "IU Team", coverImageUrl: undefined, featured: true, publishedAt: now },
      { id: 2, slug: "exam-schedule-winter", title: "Winter Exam Schedule Published", content: "The winter exam schedule has been published. Please check your course-specific dates and make sure to register before the deadline.", category: "Exams", tags: JSON.stringify(["exams","schedule"]), author: "Examination Office", coverImageUrl: undefined, featured: false, publishedAt: now },
      { id: 3, slug: "campus-maintenance-november", title: "Scheduled Campus Maintenance in November", content: "Our IT department will perform scheduled maintenance on campus systems this weekend. Short service interruptions may occur.", category: "IT", tags: JSON.stringify(["maintenance","it"]), author: "IT Services", coverImageUrl: undefined, featured: false, publishedAt: now },
      { id: 4, slug: "new-module-data-analytics", title: "New Module: Data Analytics with Python", content: "We are excited to offer a new module on Data Analytics with Python. The course covers NumPy, pandas, visualization, and basic ML.", category: "Academics", tags: JSON.stringify(["module","python","analytics"]), author: "Faculty of Computer Science", coverImageUrl: undefined, featured: true, publishedAt: now },
      { id: 5, slug: "scholarship-opportunities-2025", title: "Scholarship Opportunities 2025", content: "Applications are open for various scholarships for the 2025 academic year. Submit your application before December 15.", category: "Scholarships", tags: JSON.stringify(["scholarship","finance"]), author: "Student Office", coverImageUrl: undefined, featured: false, publishedAt: now },
      { id: 6, slug: "library-extended-hours", title: "Library Extends Opening Hours", content: "To support your studies, the campus library will extend opening hours to 00:00 from Monday to Friday.", category: "Library", tags: JSON.stringify(["library","hours"]), author: "Library Team", coverImageUrl: undefined, featured: false, publishedAt: now },
      { id: 7, slug: "career-fair-2025", title: "Join the 2025 Career Fair", content: "Our annual Career Fair brings top employers to campus. Prepare your CV and meet recruiters.", category: "Careers", tags: JSON.stringify(["career","fair","jobs"]), author: "Career Services", coverImageUrl: undefined, featured: true, publishedAt: now },
    ];
    const item = samples.find((s) => s.slug === slug) || null;
    if (item) return res.json({ item });
    return res.status(404).json({ error: "News not found" });
  }
});

// Serve static files from build/client BEFORE React Router handler
app.use(
  express.static(clientBuildPath, {
    maxAge: "1d",
    etag: false,
  })
);

// Note: Do NOT add a catch-all 404 for /api/* here.
// React Router's data API uses paths like /route.data and query params under /api/*,
// which must be handled by createRequestHandler below. A catch-all here would
// intercept those requests and cause 404s (e.g., /api/login.data).

// React Router handler (catches everything else)
app.use(
  createRequestHandler({
    // Cast to avoid type mismatch between generated build and ServerBuild interface
    build: serverBuild as any,
    mode: "production",
  })
);

// Vercel expects export, not app.listen()
export default app;
