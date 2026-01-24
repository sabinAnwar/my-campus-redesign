import express, { type Request, type Response } from "express";
import { prisma } from "../utils/db";
import { getSessionToken } from "../utils/helpers";

const router = express.Router();

// Simple current user endpoint (used by dashboard)
router.get("/", async (req: Request, res: Response) => {
  try {
    const token = getSessionToken(req);
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    // Derive campus/location info (placeholder until real data available)
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

export default router;
