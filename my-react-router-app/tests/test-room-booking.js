import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTest() {
  console.log("Starting Room Booking DB Test...");

  try {
    // 1. Setup: Find a test user
    // We'll use the user ID 82 from the logs if it exists, otherwise the first user found
    let user = await prisma.user.findUnique({ where: { id: 82 } });
    if (!user) {
      console.log("User 82 not found, picking the first available user...");
      user = await prisma.user.findFirst();
    }

    if (!user) {
      console.error("No users found in database. Run seed first.");
      return;
    }

    console.log(`Using User: ${user.name || user.username} (ID: ${user.id})`);

    // 2. Define Booking Data
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const bookingData = {
      user_id: user.id,
      room_id: "TEST-ROOM-1",
      room_name: "Test Room A",
      campus: "Hammerbrook",
      date: new Date(today), // Midnight
      start_time: "10:00",
      end_time: "12:00",
    };

    // 3. Cleanup: Remove any existing test bookings for this slot
    await prisma.roomBooking.deleteMany({
      where: {
        room_id: bookingData.room_id,
        date: bookingData.date,
      },
    });
    console.log("🧹 Cleaned up old test bookings.");

    // 4. Create First Booking (The "Existing" Booking)
    console.log("📝 Creating Booking 1 (The Blocker)...");
    const booking1 = await prisma.roomBooking.create({
      data: bookingData,
    });
    console.log("✅ Booking 1 created:", booking1.id);

    // 5. Test Conflict Logic: Check if a NEW booking would collide
    console.log("⚔️ Testing Room Conflict (Same Room)...");
    // Simulate a second user trying to book the same room
    const conflictCheck = await prisma.roomBooking.findFirst({
      where: {
        room_name: bookingData.room_name,
        campus: bookingData.campus,
        date: bookingData.date,
        start_time: { lt: bookingData.end_time }, // < 12:00
        end_time: { gt: bookingData.start_time }, // > 10:00
        // We do NOT exclude booking1 here because we checking if ANY booking exists
        // blocking this slot.
        // But to be precise, usually we exclude the "current being created" booking ID if it existed,
        // but here we are simulating a "new" request which has no ID yet.
      },
    });

    if (conflictCheck && conflictCheck.id === booking1.id) {
      console.log("✅ Conflict CORRECTLY detected (Found Booking 1):", conflictCheck.id);
    } else {
      console.error("❌ Conflict NOT detected (Failed). Expected to find Booking 1.");
    }

    // 6. Test Double Booking Logic: Same User, Different Room, Overlapping Time
    console.log("⚔️ Testing User Double Booking (Different Room)...");
    const otherRoomData = {
      ...bookingData,
      room_id: "TEST-ROOM-2",
      room_name: "Test Room B",
    };
    
    // Check logic
    const userConflict = await prisma.roomBooking.findFirst({
      where: {
        user_id: user.id,
        date: otherRoomData.date,
        start_time: { lt: otherRoomData.end_time },
        end_time: { gt: otherRoomData.start_time },
        id: { not: booking1.id },
      },
    });

    if (userConflict) {
      console.log("✅ User Double Booking CORRECTLY detected:", userConflict.id);
    } else {
      console.error("❌ User Double Booking NOT detected (Failed).");
    }

    // 7. Cleanup
    console.log("🧹 Final Cleanup...");
    await prisma.roomBooking.delete({ where: { id: booking1.id } });
    console.log("✅ Test Booking deleted.");

    console.log("✨ Test Suite Completed.");

  } catch (error) {
    console.error("💥 Test Failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();
