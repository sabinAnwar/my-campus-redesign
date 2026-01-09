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
    const nodemailer = await import('nodemailer');
    
    // Create transporter
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"IU Student Portal" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(' Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error(' Error sending email:', error);
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
        { status: 400 }
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
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; border-radius: 4px; }
            .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;"> Neue Support-Anfrage</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">IU Student Portal</p>
            </div>
            <div class="content">
              <div class="info-box">
                <div class="label">Von:</div>
                <div>${user.name} (${user.email})</div>
              </div>
              
              <div class="info-box">
                <div class="label">Betreff:</div>
                <div>${subject}</div>
              </div>
              
              <div class="info-box">
                <div class="label">Nachricht:</div>
                <div style="white-space: pre-wrap;">${message}</div>
              </div>
              
              <div class="info-box">
                <div class="label">Eingereicht am:</div>
                <div>${new Date().toLocaleString('de-DE')}</div>
              </div>
              
              <div class="info-box">
                <div class="label">Submission ID:</div>
                <div>${contactSubmission.id}</div>
              </div>
            </div>
            <div class="footer">
              <p>Diese E-Mail wurde automatisch vom IU Student Portal generiert.</p>
              <p>Bitte antworten Sie direkt an ${user.email}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to your address
    await sendEmail("demoanwar2@gmail.com", emailSubject, emailHtml);

    // Also send confirmation email to the user
    const userConfirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .success-icon { font-size: 48px; margin-bottom: 10px; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon"></div>
              <h1 style="margin: 0;">Nachricht erhalten!</h1>
            </div>
            <div class="content">
              <p>Hallo ${user.name},</p>
              <p>Vielen Dank für deine Nachricht. Wir haben deine Anfrage erhalten und werden uns schnellstmöglich bei dir melden.</p>
              <p><strong>Deine Anfrage:</strong></p>
              <p style="background: white; padding: 15px; border-left: 4px solid #10b981; border-radius: 4px;">
                <strong>Betreff:</strong> ${subject}<br>
                <strong>Nachricht:</strong> ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}
              </p>
              <p>Durchschnittliche Antwortzeit: <strong>1 Stunde</strong></p>
            </div>
            <div class="footer">
              <p>IU Student Portal - Support Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail(user.email, "Deine Support-Anfrage wurde erhalten", userConfirmationHtml);

    return Response.json({
      success: true,
      message: "Nachricht erfolgreich gesendet",
      submissionId: contactSubmission.id,
    });

  } catch (error) {
    console.error("Error submitting contact form:", error);
    return Response.json(
      { error: "Fehler beim Senden der Nachricht" },
      { status: 500 }
    );
  }
}
