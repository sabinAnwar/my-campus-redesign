import { PrismaClient } from "@prisma/client";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";

//// DATABASE CLIENT
//
const prisma = new PrismaClient();

//// TYPES
//
interface BookingFormData {
  user_id: string;
  room_id: string;
  room_name: string;
  campus: string;
  date: string;
  start_time: string;
  end_time: string;
}

//// HELPER FUNCTIONS
//
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
  const user_id = getFormString(formData, "userId") || getFormString(formData, "user_id");
  const room_id = getFormString(formData, "roomId") || getFormString(formData, "room_id");
  const room_name = getFormString(formData, "roomName") || getFormString(formData, "room_name");
  const campus = getFormString(formData, "campus");
  const date = getFormString(formData, "date");
  const start_time = getFormString(formData, "startTime") || getFormString(formData, "start_time");
  const end_time = getFormString(formData, "endTime") || getFormString(formData, "end_time");

  if (!user_id || !room_id || !room_name || !campus || !date || !start_time || !end_time) {
    return null;
  }

  return { user_id, room_id, room_name, campus, date, start_time, end_time };
}

//// LOADER - Fetch all bookings for a user
//
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const bookings = await prisma.roomBooking.findMany({
      where: {
        user_id: parseInt(userId, 10),
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

//// ACTION - Create or delete bookings
//
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

//// ACTION HANDLERS
//
async function handleCreateBooking(formData: FormData) {
  const data = parseBookingFormData(formData);

  if (!data) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { user_id, room_id, room_name, campus, date, start_time, end_time } = data;

  // Check if room is already booked for this time slot
  const existingBooking = await prisma.roomBooking.findFirst({
    where: {
      room_id: data.room_id,
      campus,
      date: new Date(date),
      OR: [
        {
          AND: [
            { start_time: { lte: data.start_time } },
            { end_time: { gt: data.start_time } },
          ],
        },
        {
          AND: [
            { start_time: { lt: data.end_time } },
            { end_time: { gte: data.end_time } },
          ],
        },
        {
          AND: [
            { start_time: { gte: data.start_time } },
            { end_time: { lte: data.end_time } },
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
      user_id: parseInt(data.user_id, 10),
      room_id: data.room_id,
      room_name: data.room_name,
      campus,
      date: new Date(date),
      start_time: data.start_time,
      end_time: data.end_time,
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
