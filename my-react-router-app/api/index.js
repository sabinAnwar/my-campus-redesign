import express from "express";
import { createRequestHandler } from '@react-router/express';
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import * as build from "../build/server/nodejs_eyJydW50aW1lIjoibm9kZWpzIn0/index.js";

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(express.json());

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

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ error: "Please provide a valid email address" });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Please provide a password" });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create session cookie
    const sessionId = crypto.randomUUID();
    res.cookie("auth_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Failed to process login" });
  }
});

// Password reset request endpoint
app.post("/api/request-password-reset", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ error: "Please provide a valid email address" });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      return res.json({
        success: true,
        message:
          "If an account exists with this email, you will receive a password reset link shortly.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomUUID();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    // Send email
    const resetLink = `${process.env.APP_URL || "http://localhost:5174"}/reset-password/${resetToken}`;

    const emailResponse = await sendPasswordResetEmail(email, resetLink);

    return res.json({
      success: true,
      message:
        "If an account exists with this email, you will receive a password reset link shortly.",
      // In development, return the link for testing
      ...(process.env.NODE_ENV === "development" && { resetLink, resetToken }),
    });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return res
      .status(500)
      .json({ error: "Failed to process password reset request" });
  }
});

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
    console.error("Error sending password reset email:", error);
    return false;
  }
}

// React Router SSR handler
app.use(createRequestHandler({
  build,
  mode: 'production',
}));

// Vercel expects export, not app.listen()
export default app;
