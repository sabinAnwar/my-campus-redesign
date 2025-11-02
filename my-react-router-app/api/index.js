import express from "express";
import cookieParser from "cookie-parser";
import { createRequestHandler } from '@react-router/express';
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import * as build from "../build/server/nodejs_eyJydW50aW1lIjoibm9kZWpzIn0/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, '../build/client');

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
app.use((req, res, next) => {
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
app.get("/.well-known/appspecific/:filename", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send("User-agent: *\nDisallow: /admin\n");
});

app.get("/sitemap.xml", (req, res) => {
  res
    .type("text/xml")
    .send(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
    );
});

// Health check endpoint
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Small helper: get session token from cookie or header, accept both legacy and new names
function getSessionToken(req) {
  const cookieToken =
    req.cookies?.session || req.cookies?.auth_session || null;
  const headerToken = req.get("X-Session-Token") || req.get("x-session-token") || null;
  return cookieToken || headerToken || null;
}

function getCookieOptions(req) {
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
app.get("/api/user", async (req, res) => {
  try {
    console.log("🔎 /api/user headers", {
      cookie: req.headers?.cookie || null,
      xSession: req.get("x-session-token") || req.get("X-Session-Token") || null,
    });
    const token = getSessionToken(req);
    console.log("🔑 /api/user resolved token", token);
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
    console.log("🗄️ /api/user session lookup", !!session, session?.user ? "has-user" : "no-user");
    if (!session || !session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    return res.json({
      user: {
        id: session.user.id,
        name: session.user.name || "Student",
        email: session.user.email,
      },
    });
  } catch (err) {
    console.error("/api/user error", err);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Logout endpoint (support .data too)
async function handleLogout(req, res) {
  try {
    const token = getSessionToken(req);
    if (token) {
      await prisma.session.deleteMany({ where: { token } });
    }
    res.cookie("session", "", { ...getCookieOptions(req), maxAge: 0 });
    return res.json({ success: true });
  } catch (err) {
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
  } catch (error) {
    console.error("❌ Error requesting password reset:", error);
    console.error("   Error stack:", error.stack);
    return res.status(500).json({
      error: "Failed to process password reset request",
      details: error.message,
    });
  }
  }
);

async function sendPasswordResetEmail(email, resetLink) {
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
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

    if (!cronSecret || secret !== cronSecret) {
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
      ((d - yearStart) / 86400000 + (yearStart.getDay() || 7)) / 7
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

    const submittedIds = new Set(submitted.map((r) => r.userId));
    const targets = students.filter((s) => !submittedIds.has(s.id));

    console.log(`📬 Targeting ${targets.length} students for reminders`);

    if (dryRun) {
      return res.json({
        success: true,
        dryRun: true,
        currentWeekKey,
        targetCount: targets.length,
        targets: targets.map((t) => t.email),
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
        const portalLink = `${appUrl}/praxisbericht`;

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
      } catch (err) {
        console.error(
          `❌ Failed to send email to ${student.email}:`,
          err.message
        );
      }
    }

    console.log(`📊 Sent ${sent}/${targets.length} reminder emails`);

    return res.json({
      success: true,
      sent,
      currentWeekKey,
    });
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    console.error("❌ Error updating praxisbericht:", error);
    return res.status(500).json({ error: "Failed to update report" });
  }
});

// -----------------------------
// News API (public)
// -----------------------------
// IMPORTANT: Must be registered BEFORE the React Router handler below.

// Helper to safely parse ints with default
function toInt(value, def) {
  const n = parseInt(value, 10);
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
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { excerpt: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category && { category: { equals: category, mode: "insensitive" } }),
    };

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where,
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
      prisma.news.count({ where }),
    ]);

    // optional tag filter on result set (tags stored as JSON string)
    const filtered = tag
      ? items.filter((n) => {
          try {
            const arr = JSON.parse(n.tags || "[]");
            return Array.isArray(arr) && arr.some((t) => String(t).toLowerCase() === tag.toLowerCase());
          } catch (_) {
            return false;
          }
        })
      : items;

    return res.json({ items: filtered, total, page, pageSize });
  } catch (err) {
    console.warn("/api/news fallback due to error:", err.message);
    // Fallback: multiple static samples when DB not migrated, with filtering + pagination
    const now = new Date();
    const daysAgo = (d) => {
      const t = new Date(now);
      t.setDate(now.getDate() - d);
      return t.toISOString();
    };
    const all = [
      { id: 7, slug: "career-fair-2025", title: "Join the 2025 Career Fair", excerpt: "Meet employers, attend workshops, and grow your network.", content: "Career fair details", category: "Careers", tags: JSON.stringify(["career","fair","jobs"]), author: "Career Services", coverImageUrl: undefined, featured: true, publishedAt: daysAgo(0) },
      { id: 4, slug: "new-module-data-analytics", title: "New Module: Data Analytics with Python", excerpt: "Enroll now for the upcoming semester to learn modern analytics.", content: "Module details", category: "Academics", tags: JSON.stringify(["module","python","analytics"]), author: "Faculty of Computer Science", coverImageUrl: undefined, featured: true, publishedAt: daysAgo(2) },
      { id: 1, slug: "welcome-to-the-portal", title: "Welcome to the IU Student Portal", excerpt: "Everything you need in one place: marks, applications, modules, and more.", content: "Welcome content", category: "Announcements", tags: JSON.stringify(["announcement","portal"]), author: "IU Team", coverImageUrl: undefined, featured: false, publishedAt: daysAgo(3) },
      { id: 2, slug: "exam-schedule-winter", title: "Winter Exam Schedule Published", excerpt: "Check the dates and registration deadlines for the winter term.", content: "Exam schedule details", category: "Exams", tags: JSON.stringify(["exams","schedule"]), author: "Examination Office", coverImageUrl: undefined, featured: false, publishedAt: daysAgo(4) },
      { id: 3, slug: "campus-maintenance-november", title: "Scheduled Campus Maintenance in November", excerpt: "Short downtimes may occur on selected services next weekend.", content: "Maintenance details", category: "IT", tags: JSON.stringify(["maintenance","it"]), author: "IT Services", coverImageUrl: undefined, featured: false, publishedAt: daysAgo(5) },
      { id: 5, slug: "scholarship-opportunities-2025", title: "Scholarship Opportunities 2025", excerpt: "Multiple scholarships for outstanding students now available.", content: "Scholarship details", category: "Scholarships", tags: JSON.stringify(["scholarship","finance"]), author: "Student Office", coverImageUrl: undefined, featured: false, publishedAt: daysAgo(7) },
      { id: 6, slug: "library-extended-hours", title: "Library Extends Opening Hours", excerpt: "From next month, the library will be open until midnight.", content: "Library details", category: "Library", tags: JSON.stringify(["library","hours"]), author: "Library Team", coverImageUrl: undefined, featured: false, publishedAt: daysAgo(9) },
    ];
    const q = (search || "").toLowerCase();
    let filtered = all;
    if (q) {
      filtered = filtered.filter((n) =>
        [n.title, n.excerpt, n.content].some((t) => (t || "").toLowerCase().includes(q))
      );
    }
    if (category) {
      filtered = filtered.filter((n) => (n.category || "").toLowerCase() === category.toLowerCase());
    }
    if (tag) {
      filtered = filtered.filter((n) => {
        try {
          const arr = JSON.parse(n.tags || "[]");
          return Array.isArray(arr) && arr.some((t) => String(t).toLowerCase() === tag.toLowerCase());
        } catch {
          return false;
        }
      });
    }
    // Sort featured first, then by publishedAt desc
    filtered = filtered.sort((a, b) => {
      if (a.featured === b.featured) {
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      }
      return a.featured ? -1 : 1;
    });
    const total = filtered.length;
    const items = filtered.slice(skip, skip + pageSize).map(({ content, ...rest }) => rest);
    return res.json({ items, total, page, pageSize });
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
  } catch (err) {
    console.warn("/api/news/:slug fallback due to error:", err.message);
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
app.use(createRequestHandler({
  build,
  mode: 'production',
}));

// Vercel expects export, not app.listen()
export default app;
