import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || "student@iu.edu";
  const token = process.argv[3] || "testtoken-123";
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error("User not found:", email);
    process.exit(1);
  }
  // Remove any existing session with same token to avoid unique conflict
  await prisma.session.deleteMany({ where: { token } });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await prisma.session.create({
    data: { token, userId: user.id, expiresAt },
  });
  console.log("Created session:", session);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
