import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = "http://localhost:5173/api/cron/daily-reminders";

async function runTest() {
  console.log("Starting Praxis Report Reminder API Test...");

  // 1. Setup User
  const userId = 82;
  console.log(`preparing User ${userId}...`);
  
  // Ensure user exists
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    console.error("❌ User 82 not found. Cannot proceed.");
    process.exit(1);
  }

  // Update user to have reminders enabled
  await prisma.user.update({
    where: { id: userId },
    data: {
      reminder_enabled: true,
      reminder_timezone: "Europe/Berlin", // Ensure timezone matches our logic
    }
  });
  console.log("✅ User updated: Reminders enabled.");

  // 2. Calculate "Current" Time (approximate Berlin time)
  
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Berlin",
  });
  const parts = fmt.formatToParts(now);
  const hour = parseInt(parts.find(p => p.type === "hour").value, 10);
  const minute = parseInt(parts.find(p => p.type === "minute").value, 10);

  console.log(`🕒 Current Server Time (Berlin): ${hour}:${minute}`);

  // 3. Cleanup: Delete any existing report for this week
  function getIsoWeekKey(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    const weekStr = String(weekNo).padStart(2, "0");
    return `${d.getUTCFullYear()}-W${weekStr}`;
  }
  
  const weekKey = getIsoWeekKey(now);
  console.log(`📅 Current ISO Week: ${weekKey}`);

  await prisma.practicalReport.deleteMany({
    where: {
        user_id: userId,
        iso_week_key: weekKey
    }
  });
  console.log("🧹 Cleaned up existing reports for this week.");


  // 4. Test A: Should Send Email
  console.log("\n🧪 TEST CASE A: Report Missing -> Should Send Reminder");
  try {
      const params = new URLSearchParams({
          userId: userId.toString(),
          hour: hour.toString(),
          minute: minute.toString(),
      });

      console.log(`📡 Calling API: ${API_URL}?${params.toString()}`);
      
      const res = await fetch(`${API_URL}?${params.toString()}`);
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("❌ Failed to parse JSON. Response was:\n", text.substring(0, 2000));
        throw new Error("Invalid JSON response");
      }
      
      console.log("📥 API Response:", data);

      if (data.success && data.sent === 1) {
          console.log("✅ PASS: Reminder sent as expected.");
      } else {
          console.error("❌ FAIL: Expected sent=1, got:", data.sent);
      }

  } catch (error) {
      console.error("💥 API Call Failed:", error);
      console.log("⚠️ Is the dev server running on localhost:5173?");
  }

  // 5. Test B: Should NOT Send (Report Exists)
  console.log("\n🧪 TEST CASE B: Report Submitted -> Should SKIP Reminder");
  
  // Create a dummy report
  await prisma.practicalReport.create({
      data: {
          user_id: userId,
          iso_week_key: weekKey,
          status: "SUBMITTED",
          tasks: "Test Content",
          days: {},
          grade: 0
      }
  });
  console.log("📝 Dummy report created.");

  try {
      const params = new URLSearchParams({
          userId: userId.toString(),
          hour: hour.toString(),
          minute: minute.toString(),
      });
      
      const res = await fetch(`${API_URL}?${params.toString()}`);
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("❌ Failed to parse JSON. Response was:\n", text.substring(0, 2000));
        throw new Error("Invalid JSON response");
      }
      console.log("📥 API Response:", data);

      if (data.success && data.sent === 0) {
          console.log("✅ PASS: Reminder skipped as expected.");
      } else {
          console.error("❌ FAIL: Expected sent=0, got:", data.sent);
      }

  } catch (error) {
     console.error("💥 API Call Failed:", error);
  }

  // Cleanup Report
  await prisma.practicalReport.deleteMany({
      where: { user_id: userId, iso_week_key: weekKey }
  });
  console.log("\n🧹 Cleanup completed.");
  
  await prisma.$disconnect();
}

runTest();
