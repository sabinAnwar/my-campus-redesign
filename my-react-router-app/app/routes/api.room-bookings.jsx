import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all bookings for a user
export async function loader({ request }) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const bookings = await prisma.roomBooking.findMany({
      where: {
        userId: parseInt(userId),
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

// POST - Create a new booking
export async function action({ request }) {
  try {
    const formData = await request.formData();
    const actionType = formData.get("_action");

    if (actionType === "create") {
      const userId = formData.get("userId");
      const roomId = formData.get("roomId");
      const roomName = formData.get("roomName");
      const campus = formData.get("campus");
      const date = formData.get("date");
      const startTime = formData.get("startTime");
      const endTime = formData.get("endTime");

      if (!userId || !roomId || !roomName || !campus || !date || !startTime || !endTime) {
        return Response.json({ error: "Missing required fields" }, { status: 400 });
      }

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
          userId: parseInt(userId),
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

    if (actionType === "delete") {
      const bookingId = formData.get("bookingId");

      if (!bookingId) {
        return Response.json({ error: "Booking ID is required" }, { status: 400 });
      }

      await prisma.roomBooking.delete({
        where: {
          id: parseInt(bookingId),
        },
      });

      return Response.json({ success: true, message: "Booking deleted" });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in room booking action:", error);
    return Response.json({ error: "Failed to process request" }, { status: 500 });
  }
}
