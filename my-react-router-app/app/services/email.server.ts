import nodemailer from "nodemailer";

export async function createTransporter() {
  // Support both EMAIL_* and SMTP_* env var naming conventions
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASSWORD || process.env.SMTP_PASSWORD;
  const service = process.env.EMAIL_SERVICE;

  if (service === "gmail" || (!service && user && pass)) {
    if (!user || !pass) {
      throw new Error(
        "Missing email credentials. Set EMAIL_USER/EMAIL_PASSWORD or SMTP_USER/SMTP_PASSWORD environment variables.",
      );
    }
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }

  if (service === "sendgrid") {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error("Missing SENDGRID_API_KEY environment variable.");
    }
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }

  // Fallback to test account for development
  console.warn("No email credentials configured. Using Ethereal test account.");
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}
