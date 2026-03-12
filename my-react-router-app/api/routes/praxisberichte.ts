import express, { type Request, type Response } from "express";
import { prisma } from "../utils/db";
import { getSessionToken } from "../utils/helpers";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
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
    const reports = await prisma.practicalReport.findMany({
      where: { user_id: session.user.id },
      orderBy: { iso_week_key: "asc" },
    });

    return res.json({
      reports,
      studiengangName: session.user.study_program || null,
    });
  } catch (error: unknown) {
    console.error(" Error fetching praxisberichte:", error);
    return res.status(500).json({ error: "Failed to fetch reports" });
  }
});

router.put("/:weekKey", express.json(), async (req: Request, res: Response) => {
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

    const report = await prisma.practicalReport.upsert({
      where: {
        iso_week_key_user_id: {
          iso_week_key: weekKey,
          user_id: session.user.id,
        },
      },
      create: {
        iso_week_key: weekKey,
        user_id: session.user.id,
        days: days || {},
        tasks,
        grade: grade || 0,
        status: (status || "DUE").toUpperCase(),
        edited_at: new Date(),
      },
      update: {
        days: days || {},
        tasks,
        grade: grade || 0,
        status: (status || "DUE").toUpperCase(),
        edited_at: new Date(),
      },
    });

    // Send confirmation email if status is SUBMITTED
    if ((status || "").toUpperCase() === "SUBMITTED") {
      try {
        const { createTransporter } = require("../utils/email");
        const transporter = await createTransporter();
        const emailSubject = `Praxisbericht eingereicht: Woche ${weekKey}`;

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
                <div style="background: #174f26; color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                  <span style="font-size: 48px; margin-bottom: 10px; display: block;">✓</span>
                  <h1 style="margin: 0; font-size: 26px;">Bericht eingereicht!</h1>
                </div>
                <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
                  <p style="font-size: 18px; margin-bottom: 20px;">Hallo ${session.user.name},</p>
                  <p style="font-size: 16px;">Dein Praxisbericht für die Woche <strong>${weekKey}</strong> wurde erfolgreich gespeichert.</p>
                  
                  <div style="background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #174f26; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                    <div style="font-weight: bold; color: #174f26; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #eee; padding-bottom: 5px;">Zusammenfassung</div>
                    <div style="margin-bottom: 10px; font-size: 16px;"><strong>Status:</strong> <span style="color: #174f26; font-weight: bold;">Eingereicht</span></div>
                    <div style="margin-bottom: 5px; font-size: 16px;"><strong>Aufgaben:</strong></div>
                    <div style="color: #555; background: #f3f4f6; padding: 10px; border-radius: 4px; font-style: italic; font-size: 15px;">"${tasks.substring(0, 200)}${tasks.length > 200 ? "..." : ""}"</div>
                  </div>
                  
                  <p style="font-size: 15px; color: #555;">Dein Betreuer wird benachrichtigt.</p>
                </div>
                <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-radius: 0 0 10px 10px;">
                  <p>IU Student Plattform - Praxisbericht System</p>
                </div>
              </div>
            </body>
          </html>
        `;

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || "noreply@iu-Plattform.com",
          to: session.user.email, // Send to student
          subject: emailSubject,
          html: emailHtml,
        });
      } catch (err) {
        console.error("Failed to send submission email", err);
      }
    }

    return res.json(report);
  } catch (error: unknown) {
    console.error(" Error updating praxisbericht:", error);
    return res.status(500).json({ error: "Failed to update report" });
  }
});

export default router;
