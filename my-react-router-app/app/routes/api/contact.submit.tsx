import { PrismaClient } from "@prisma/client";
import type { ActionFunctionArgs } from "react-router";

const prisma = new PrismaClient();

// Helper to get user from session
async function getUser(request: Request) {
  const cookieHeader = request.headers.get("Cookie") || "";
  let sessionToken = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("session="))
    ?.split("=")[1];

  if (!sessionToken) {
    sessionToken = request.headers.get("X-Session-Token") || undefined;
  }

  if (!sessionToken) return null;

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  });

  if (!session || new Date() > session.expires_at) return null;
  return session.user;
}

// Email sending function using Nodemailer
async function sendEmail(to: string, subject: string, html: string) {
  try {
    // Import nodemailer dynamically
    const nodemailer = await import("nodemailer");

    // Create transporter
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from:
        process.env.SMTP_FROM ||
        `"IU Student Plattform" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(" Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error(" Error sending email:", error);
    // Don't throw error - we still want to save the submission even if email fails
    return false;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Get the current user
    const user = await getUser(request);

    if (!user) {
      return Response.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    // Parse the form data
    const data = await request.json();
    const { subject, message } = data;

    if (!subject || !message) {
      return Response.json(
        { error: "Betreff und Nachricht sind erforderlich" },
        { status: 400 },
      );
    }

    // Save to database
    const contactSubmission = await prisma.contactSubmission.create({
      data: {
        user_id: user.id,
        subject,
        message,
        status: "PENDING",
      },
    });

    // Prepare email content
    const emailSubject = `Neue Support-Anfrage: ${subject}`;
    const emailHtml = `
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
              <h1 style="margin: 0; font-size: 26px;">Neue Support-Anfrage</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 16px;">IU Student Plattform</p>
            </div>
            <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
              <div style="background: white; padding: 20px; margin: 15px 0; border-left: 4px solid #111f60; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                <div style="font-weight: bold; color: #111f60; margin-bottom: 5px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Von</div>
                <div style="font-size: 16px;">${user.name} (<a href="mailto:${user.email}" style="color: #111f60; text-decoration: none;">${user.email}</a>)</div>
              </div>
              
              <div style="background: white; padding: 20px; margin: 15px 0; border-left: 4px solid #111f60; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                <div style="font-weight: bold; color: #111f60; margin-bottom: 5px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Betreff</div>
                <div style="font-size: 18px; font-weight: 500;">${subject}</div>
              </div>
              
              <div style="background: white; padding: 20px; margin: 15px 0; border-left: 4px solid #111f60; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                <div style="font-weight: bold; color: #111f60; margin-bottom: 5px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Nachricht</div>
                <div style="white-space: pre-wrap; color: #4b5563; font-size: 16px;">${message}</div>
              </div>
              
              <div style="background: white; padding: 20px; margin: 15px 0; border-left: 4px solid #111f60; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left" valign="top">
                      <div style="font-weight: bold; color: #111f60; margin-bottom: 5px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Eingereicht am</div>
                      <div style="font-size: 15px;">${new Date().toLocaleString("de-DE")}</div>
                    </td>
                    <td align="right" valign="top">
                       <div style="font-weight: bold; color: #111f60; margin-bottom: 5px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">ID</div>
                       <div style="font-family: monospace; background: #eee; padding: 4px 8px; border-radius: 4px; font-size: 15px; display: inline-block;">#${contactSubmission.id}</div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-radius: 0 0 10px 10px;">
              <p>Diese E-Mail wurde automatisch generiert.</p>
              <p>&copy; ${new Date().getFullYear()} IU Student Plattform</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to your address
    await sendEmail("sabinanwar2@gmail.com", emailSubject, emailHtml);

    // Also send confirmation email to the user
    const userConfirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
             body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #174f26; color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <span style="font-size: 48px; margin-bottom: 10px; display: block;">✓</span>
              <h1 style="margin: 0; font-size: 26px;">Anfrage erhalten!</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
              <p style="font-size: 18px; margin-bottom: 20px;">Hallo ${user.name},</p>
              <p style="font-size: 16px;">Wir haben deine Nachricht erhalten. Unser Support-Team wird sich schnellstmöglich bei dir melden.</p>
              
              <div style="background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #174f26; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                <div style="font-weight: bold; color: #174f26; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #eee; padding-bottom: 5px;">Deine Nachricht</div>
                <div style="margin-bottom: 10px; font-size: 16px;"><strong>Betreff:</strong> ${subject}</div>
                <div style="color: #555; font-style: italic; font-size: 15px;">"${message.substring(0, 300)}${message.length > 300 ? "..." : ""}"</div>
              </div>
              
              <p style="font-size: 15px; color: #555;">Durchschnittliche Antwortzeit: <strong>< 24 Stunden</strong></p>
            </div>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-radius: 0 0 10px 10px;">
              <p>IU Student Plattform - Support Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail(
      user.email,
      "Deine Support-Anfrage wurde erhalten",
      userConfirmationHtml,
    );

    return Response.json({
      success: true,
      message: "Nachricht erfolgreich gesendet",
      submissionId: contactSubmission.id,
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return Response.json(
      { error: "Fehler beim Senden der Nachricht" },
      { status: 500 },
    );
  }
}
