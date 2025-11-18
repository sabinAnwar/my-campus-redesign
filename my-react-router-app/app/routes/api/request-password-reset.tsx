import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function sendPasswordResetEmail(email: string, resetLink: string) {
  try {
    let transporter;
    
    if (process.env.EMAIL_SERVICE === 'gmail') {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        }
      });
    } else if (process.env.EMAIL_SERVICE === 'sendgrid') {
      transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        }
      });
    } else {
      // Development mode - use Ethereal Email
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        }
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@iu-portal.com',
      to: email,
      subject: 'IU Portal - Password Reset Request',
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
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

export async function action({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    return Response.json({ id: `${Date.now()}`, error: 'Method not allowed' }, { status: 405 });
  }

  try {
    console.log("📝 Password reset action called");
    console.log("   Content-Type:", request.headers.get("content-type"));

    let email: string | null = null;

    // Try to parse as form data
    try {
      const formData = await request.formData();
      const emailEntry = formData.get("email");
      email = typeof emailEntry === "string" ? emailEntry : null;
      console.log("✅ Parsed as formData");
    } catch (formError) {
      const errorMsg =
        formError instanceof Error
          ? formError.message
          : String(formError);
      console.log("⚠️  formData() failed:", errorMsg);
      
      // Fallback: try to parse as JSON
      try {
        const json: unknown = await request.json();
        if (typeof json === "object" && json !== null) {
          const obj = json as { email?: unknown };
          if (typeof obj.email === "string") {
            email = obj.email;
          }
        }
        console.log("✅ Parsed as JSON");
      } catch (jsonError) {
        console.log("❌ Both formData and JSON parsing failed");
        throw new Error("Could not parse request body");
      }
    }

    console.log("📧 Email:", email, "Type:", typeof email);

    if (!email || typeof email !== "string") {
      console.log("❌ Invalid email");
      return Response.json(
        {
          id: `${Date.now()}`,
          error: "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    // Find user by email (case-insensitive)
    console.log("🔍 Looking up user with email:", email.toLowerCase());
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    
    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      console.log("⚠️  No user found for email:", email);
      return Response.json({ 
        id: `${Date.now()}`,
        success: true, 
        message: 'If an account exists with this email, you will receive a password reset link shortly.' 
      });
    }

    console.log("👤 User found:", user.email);

    // Generate reset token
    const resetToken = crypto.randomUUID();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    console.log("🔐 Generated reset token");

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    console.log("📧 Sending password reset email...");

    // Send email
    const resetLink = `${process.env.APP_URL || "https://iu-mycampus.me"}/reset-password/${resetToken}`;

    const emailResponse = await sendPasswordResetEmail(email, resetLink);
    
    console.log("✅ Password reset email sent");

    return Response.json({
      id: `${Date.now()}`,
      success: true,
      message:
        "If an account exists with this email, you will receive a password reset link shortly.",
      // In development, return the link for testing
      ...(process.env.NODE_ENV === "development" && {
        resetLink,
        resetToken,
      }),
    });
  } catch (error) {
    // Normalize unknown error to extract message and stack safely
    let errMessage = 'Unknown error';
    let errStack: string | undefined = undefined;

    if (error instanceof Error) {
      errMessage = error.message;
      errStack = error.stack;
    } else if (typeof error === 'string') {
      errMessage = error;
    } else {
      try {
        errMessage = JSON.stringify(error);
      } catch (e) {
        // ignore serialization errors
      }
    }

    console.error('❌ Error requesting password reset:', errMessage);
    if (errStack) {
      console.error('   Stack:', errStack);
    }

    return Response.json({ id: `${Date.now()}`, error: 'Failed to process password reset request', details: errMessage }, { status: 500 });
  }
}

export default function RequestPasswordReset() {
  return null;
}
