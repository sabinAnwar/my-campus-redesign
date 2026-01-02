import { PrismaClient } from "@prisma/client";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";

// ============================================================================
// DATABASE CLIENT
// ============================================================================

const prisma = new PrismaClient();

// ============================================================================
// TYPES
// ============================================================================

interface BookingFormData {
  userId: string;
  roomId: string;
  roomName: string;
  campus: string;
  date: string;
  startTime: string;
  endTime: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Safely extract string from FormData
 */
function getFormString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" ? value : null;
}

/**
 * Parse and validate booking form data
 */
function parseBookingFormData(formData: FormData): BookingFormData | null {
  const userId = getFormString(formData, "userId");
  const roomId = getFormString(formData, "roomId");
  const roomName = getFormString(formData, "roomName");
  const campus = getFormString(formData, "campus");
  const date = getFormString(formData, "date");
  const startTime = getFormString(formData, "startTime");
  const endTime = getFormString(formData, "endTime");

  if (!userId || !roomId || !roomName || !campus || !date || !startTime || !endTime) {
    return null;
  }

  return { userId, roomId, roomName, campus, date, startTime, endTime };
}

// ============================================================================
// LOADER - Fetch all bookings for a user
// ============================================================================

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const bookings = await prisma.roomBooking.findMany({
      where: {
        userId: parseInt(userId, 10),
      },
      orderBy: {
        date: "desc",
      },
    });

    return Response.json({ bookings });
  } catch (error) {
    console.error("Error fetching room bookings:", error);
    return Response.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

// ============================================================================
// ACTION - Create or delete bookings
// ============================================================================

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const actionType = getFormString(formData, "_action");

    if (actionType === "create") {
      return handleCreateBooking(formData);
    }

    if (actionType === "delete") {
      return handleDeleteBooking(formData);
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in room booking action:", error);
    return Response.json({ error: "Failed to process request" }, { status: 500 });
  }
}

// ============================================================================
// ACTION HANDLERS
// ============================================================================

async function handleCreateBooking(formData: FormData) {
  const data = parseBookingFormData(formData);

  if (!data) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { userId, roomId, roomName, campus, date, startTime, endTime } = data;

  // Check if room is already booked for this time slot
  const existingBooking = await prisma.roomBooking.findFirst({
    where: {
      roomId,
      campus,
      date: new Date(date),
      OR: [
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gt: startTime } },
          ],
        },
        {
          AND: [
            { startTime: { lt: endTime } },
            { endTime: { gte: endTime } },
          ],
        },
        {
          AND: [
            { startTime: { gte: startTime } },
            { endTime: { lte: endTime } },
          ],
        },
      ],
    },
  });

  if (existingBooking) {
    return Response.json(
      { error: "Raum ist bereits für diese Zeit gebucht" },
      { status: 409 }
    );
  }

  const booking = await prisma.roomBooking.create({
    data: {
      userId: parseInt(userId, 10),
      roomId,
      roomName,
      campus,
      date: new Date(date),
      startTime,
      endTime,
    },
  });

  return Response.json({ booking, success: true });
}

async function handleDeleteBooking(formData: FormData) {
  const bookingId = getFormString(formData, "bookingId");

  if (!bookingId) {
    return Response.json({ error: "Booking ID is required" }, { status: 400 });
  }

  await prisma.roomBooking.delete({
    where: {
      id: parseInt(bookingId, 10),
    },
  });

  return Response.json({ success: true, message: "Booking deleted" });
}
