import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("👥 Checking Users in database...\n");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      matriculationNumber: true,
      studyProgram: true,
      createdAt: true,
    },
  });

  if (users.length === 0) {
    console.log("⚠️  No users found in database");
  } else {
    console.log(`Found ${users.length} user(s):\n`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Name: ${user.name || 'N/A'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Matriculation: ${user.matriculationNumber || 'N/A'}`);
      console.log(`   Study Program: ${user.studyProgram || 'N/A'}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });
  }

  console.log("\n📊 Database Summary:");
  console.log(`   Total Users: ${users.length}`);
  console.log(`   Students: ${users.filter(u => u.role === 'STUDENT').length}`);
  console.log(`   Others: ${users.filter(u => u.role !== 'STUDENT').length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
