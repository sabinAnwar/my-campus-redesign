const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function removeDuplicateUsers() {
  console.log('🔍 Finding duplicate users...\n');

  // Find all users
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      studyProgram: true,
      semester: true,
      _count: {
        select: {
          marks: true,
          tasks: true
        }
      }
    },
    orderBy: { id: 'asc' }
  });

  console.log(`Total users: ${allUsers.length}\n`);

  // Group users by similar names
  const nameGroups = {};
  allUsers.forEach(user => {
    const baseName = user.name.toLowerCase().replace(/\s+/g, '');
    if (!nameGroups[baseName]) {
      nameGroups[baseName] = [];
    }
    nameGroups[baseName].push(user);
  });

  // Find duplicates
  const duplicates = Object.entries(nameGroups).filter(([_, users]) => users.length > 1);

  if (duplicates.length === 0) {
    console.log('✅ No duplicate users found!');
    await prisma.$disconnect();
    return;
  }

  console.log(`Found ${duplicates.length} groups of duplicate users:\n`);

  for (const [baseName, users] of duplicates) {
    console.log(`\n📋 Group: ${users[0].name}`);
    console.log('─'.repeat(60));
    
    users.forEach(user => {
      console.log(`  ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Study Program: ${user.studyProgram || 'N/A'}`);
      console.log(`  Semester: ${user.semester}`);
      console.log(`  Marks: ${user._count.marks}, Tasks: ${user._count.tasks}`);
      console.log('');
    });

    // Keep the user with more data (marks + tasks)
    const sorted = users.sort((a, b) => {
      const aData = a._count.marks + a._count.tasks;
      const bData = b._count.marks + b._count.tasks;
      return bData - aData; // Descending
    });

    const keep = sorted[0];
    const remove = sorted.slice(1);

    console.log(`  ✅ KEEP: ID ${keep.id} (${keep.email}) - ${keep._count.marks} marks, ${keep._count.tasks} tasks`);
    
    for (const user of remove) {
      console.log(`  ❌ REMOVE: ID ${user.id} (${user.email})`);
      
      // Delete the user (cascading deletes will handle related records)
      await prisma.user.delete({
        where: { id: user.id }
      });
      
      console.log(`     Deleted!`);
    }
  }

  console.log('\n✅ Cleanup complete!');
  await prisma.$disconnect();
}

removeDuplicateUsers().catch(console.error);
