const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function transferDataAndDelete() {
  const keepUser = await prisma.user.findUnique({
    where: { email: 'sabin.elanwar@iu-study.org' },
    select: { id: true, name: true, email: true }
  });

  const deleteUser = await prisma.user.findUnique({
    where: { email: 'sabinanwar6@gmail.com' },
    select: { id: true, name: true, email: true }
  });

  if (!keepUser || !deleteUser) {
    console.log('❌ Users not found');
    return;
  }

  console.log('✅ KEEP:', keepUser.name, `(${keepUser.email})`);
  console.log('❌ DELETE:', deleteUser.name, `(${deleteUser.email})`);
  console.log('');

  // 1. Transfer marks
  const marksCount = await prisma.mark.count({ where: { userId: deleteUser.id } });
  if (marksCount > 0) {
    console.log(`📊 Transferring ${marksCount} marks...`);
    await prisma.mark.deleteMany({ where: { userId: keepUser.id } });
    await prisma.mark.updateMany({
      where: { userId: deleteUser.id },
      data: { userId: keepUser.id }
    });
    console.log('✅ Marks transferred');
  }

  // 2. Transfer tasks
  const tasksCount = await prisma.studentTask.count({ where: { userId: deleteUser.id } });
  if (tasksCount > 0) {
    console.log(`📝 Transferring ${tasksCount} tasks...`);
    await prisma.studentTask.updateMany({
      where: { userId: deleteUser.id },
      data: { userId: keepUser.id }
    });
    console.log('✅ Tasks transferred');
  }

  // 3. Delete sessions
  const sessionsCount = await prisma.session.count({ where: { userId: deleteUser.id } });
  if (sessionsCount > 0) {
    console.log(`🔐 Deleting ${sessionsCount} sessions...`);
    await prisma.session.deleteMany({ where: { userId: deleteUser.id } });
    console.log('✅ Sessions deleted');
  }

  // 4. Delete files
  const filesCount = await prisma.file.count({ where: { userId: deleteUser.id } });
  if (filesCount > 0) {
    console.log(`📁 Deleting ${filesCount} files...`);
    await prisma.file.deleteMany({ where: { userId: deleteUser.id } });
    console.log('✅ Files deleted');
  }

  // 5. Delete forum topics and posts
  const topicsCount = await prisma.forumTopic.count({ where: { authorId: deleteUser.id } });
  if (topicsCount > 0) {
    console.log(`💬 Deleting ${topicsCount} forum topics...`);
    await prisma.forumTopic.deleteMany({ where: { authorId: deleteUser.id } });
  }
  
  const postsCount = await prisma.forumPost.count({ where: { authorId: deleteUser.id } });
  if (postsCount > 0) {
    console.log(`💬 Deleting ${postsCount} forum posts...`);
    await prisma.forumPost.deleteMany({ where: { authorId: deleteUser.id } });
  }

  // 6. Delete other relations
  await prisma.praxisReport.deleteMany({ where: { userId: deleteUser.id } });
  await prisma.roomBooking.deleteMany({ where: { userId: deleteUser.id } });
  await prisma.contactSubmission.deleteMany({ where: { userId: deleteUser.id } });
  await prisma.praxisHoursLog.deleteMany({ where: { userId: deleteUser.id } });
  await prisma.scheduleEvent.deleteMany({ where: { userId: deleteUser.id } });

  console.log('✅ All related data cleaned');

  // Update keep user
  await prisma.user.update({
    where: { id: keepUser.id },
    data: {
      semester: 7,
      studiengangId: 1,
      studyProgram: 'Wirtschaftsinformatik (Dual)'
    }
  });

  console.log('✅ Updated user data');

  // Now delete the old user
  await prisma.user.delete({
    where: { id: deleteUser.id }
  });

  console.log(`✅ Deleted user: ${deleteUser.email}`);
  console.log('');
  console.log('🎉 Done! Now log in with:');
  console.log('   Email: sabin.elanwar@iu-study.org');
  console.log('   Password: password123');

  await prisma.$disconnect();
}

transferDataAndDelete().catch(console.error);
