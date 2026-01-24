import express, { type Request, type Response } from "express";
import { prisma } from "../utils/db";
import { getSessionToken } from "../utils/helpers";

const router = express.Router();

router.get("/preferences", async (req: Request, res: Response) => {
  try {
    const token = getSessionToken(req);
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!session?.user) return res.status(401).json({ error: "Unauthorized" });
    const {
      reminder_enabled,
      reminder_hour,
      reminder_minute,
      reminder_timezone,
    } = session.user;
    return res.json({
      reminderEnabled: !!reminder_enabled,
      reminderHour: reminder_hour ?? 18,
      reminderMinute: reminder_minute ?? 0,
      reminderTimezone: reminder_timezone || "Europe/Berlin",
    });
  } catch (err: unknown) {
    console.error("/api/reminders/preferences GET error", err);
    return res.status(500).json({ error: "Failed to load preferences" });
  }
});

router.post(
  "/preferences",
  express.json(),
  express.urlencoded({ extended: true }),
  async (req: Request, res: Response) => {
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
        req.body.reminder_enabled ??
        req.body.reminderEnabled ??
        "false"
      ).toString();
      const hourRaw = (
        req.body.hour ??
        req.body.reminder_hour ??
        req.body.reminderHour ??
        "18"
      ).toString();
      const minuteRaw = (
        req.body.minute ??
        req.body.reminder_minute ??
        req.body.reminderMinute ??
        "0"
      ).toString();
      const tzCandidate =
        req.body.timezone ??
        req.body.reminder_timezone ??
        req.body.reminderTimezone ??
        session.user.reminder_timezone;
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
        reminder_enabled: enabled,
        reminder_hour: hour,
        reminder_timezone: tzRaw,
      };
      let savedMinute: number | null = minute;
      try {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { ...data, reminder_minute: minute },
        });
      } catch (e: unknown) {
        let msg = "";
        if (e && typeof e === "object" && "message" in e) {
          msg = String((e as any).message);
        } else if (typeof e === "string") {
          msg = e;
        }
        const minuteUnsupported =
          msg.includes("Unknown arg `reminder_minute`") ||
          msg.includes('column "reminder_minute"');
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

export default router;
