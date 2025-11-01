import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function setupUsers() {
  try {
    console.log("🔍 Setting up test users...\n");

    const users = [
      {
        email: "sabin.elanwar@iu-study.org",
        username: "sabin_elanwar",
        name: "Sabin Elanwar",
        password: "password123",
      },
      {
        email: "admin@iu.edu",
        username: "admin",
        name: "Admin User",
        password: "admin123",
        role: "ADMIN",
      },
      {
        email: "student@iu.edu",
        username: "student_001",
        name: "Test Student",
        password: "password123",
      },
    ];

    for (const userData of users) {
      try {
        let user = await prisma.user.findUnique({
          where: { email: userData.email },
        });

        if (!user) {
          console.log(`📝 Creating user: ${userData.email}`);
          const hashedPassword = await bcryptjs.hash(userData.password, 10);
          user = await prisma.user.create({
            data: {
              email: userData.email,
              username: userData.username,
              name: userData.name,
              password: hashedPassword,
              role: userData.role || "STUDENT",
            },
          });
          console.log(`✅ Created: ${user.email}\n`);
        } else {
          console.log(`🔄 User exists: ${userData.email}`);
          
          // Verify password
          const passwordValid = await bcryptjs.compare(
            userData.password,
            user.password
          );
          
          if (!passwordValid) {
            console.log(`   ⚠️  Password mismatch - updating...`);
            const hashedPassword = await bcryptjs.hash(userData.password, 10);
            user = await prisma.user.update({
              where: { email: userData.email },
              data: { password: hashedPassword },
            });
            console.log(`   ✅ Password updated\n`);
          } else {
            console.log(`   ✅ Password correct\n`);
          }
        }
      } catch (error) {
        console.error(`❌ Error with ${userData.email}:`, error.message);
      }
    }

    console.log("📋 Available test accounts:\n");
    console.log("1️⃣  Email: sabin.elanwar@iu-study.org");
    console.log("   Password: password123\n");
    console.log("2️⃣  Email: admin@iu.edu");
    console.log("   Password: admin123\n");
    console.log("3️⃣  Email: student@iu.edu");
    console.log("   Password: password123\n");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setupUsers();
