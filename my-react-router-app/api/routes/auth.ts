import express, { type Request, type Response } from "express";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { prisma } from "../utils/db";
import { getSessionToken, getCookieOptions } from "../utils/helpers";
import { sendPasswordResetEmail } from "../utils/email";

const router = express.Router();

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

router.post("/logout", handleLogout);
router.post("/logout.data", handleLogout);

// Password reset request endpoint
router.post(
  "/request-password-reset",
  express.json(),
  express.urlencoded({ extended: true }),
  async (req, res) => {
    try {
      const { email } = req.body;

      console.log(" Password reset request for:", email);

      if (!email || typeof email !== "string") {
        return res
          .status(400)
          .json({ error: "Please provide a valid email address" });
      }

      // Find user by email (case-insensitive)
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

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
        data: { reset_token: resetToken, reset_token_expiry: resetTokenExpiry },
      });

      // Send email
      const resetLink = `${process.env.APP_URL || "https://iu-mycampus.me"}/reset-password/${resetToken}`;
      await sendPasswordResetEmail(email, resetLink);

      return res.json({
        success: true,
        message:
          "If an account exists with this email, you will receive a password reset link shortly.",
        // In development, return the link for testing
        ...(process.env.NODE_ENV === "development" && {
          resetLink,
          resetToken,
        }),
      });
    } catch (error: unknown) {
      console.error(" Error requesting password reset:", error);
      return res.status(500).json({
        error: "Failed to process password reset request",
      });
    }
  }
);

// Verify password reset token endpoint
router.post(
  "/verify-reset-token",
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
          reset_token: token,
          reset_token_expiry: {
            gt: new Date(), // Token must not be expired
          },
        },
      });

      if (!user) {
        return res
          .status(400)
          .json({ error: "Invalid or expired reset token" });
      }

      return res.json({ success: true, valid: true });
    } catch (error: unknown) {
      console.error(" Error verifying reset token:", error);
      return res.status(500).json({ error: "Failed to verify token" });
    }
  }
);

// Reset password endpoint
router.post(
  "/reset-password",
  express.json(),
  express.urlencoded({ extended: true }),
  async (req, res) => {
    try {
      const { token, password } = req.body;

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
          reset_token: token,
          reset_token_expiry: {
            gt: new Date(), // Token must not be expired
          },
        },
      });

      if (!user) {
        return res
          .status(400)
          .json({ error: "Invalid or expired reset token" });
      }

      // Hash the new password
      const hashedPassword = await bcryptjs.hash(password, 10);

      // Update user password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          reset_token: null,
          reset_token_expiry: null,
        },
      });

      return res.json({
        success: true,
        message: "Password reset successfully!",
      });
    } catch (error: unknown) {
      console.error(" Error resetting password:", error);
      return res.status(500).json({ error: "Failed to reset password" });
    }
  }
);

export default router;
