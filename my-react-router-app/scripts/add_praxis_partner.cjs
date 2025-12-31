const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'sabin.elanwar@iu-study.org';
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error(`User ${email} not found!`);
    return;
  }

  console.log(`Found user ${user.name} (${user.id})`);

  const partner = await prisma.praxisPartner.upsert({
    where: { userId: user.id },
    update: {
      companyName: 'TechCorp Solutions GmbH',
      department: 'Software Engineering',
      supervisor: 'Max Mustermann',
      email: 'max.mustermann@techcorp.de',
      address: 'Musterstraße 123, 10115 Berlin',
      phone: '+49 30 12345678'
    },
    create: {
      userId: user.id,
      companyName: 'TechCorp Solutions GmbH',
      department: 'Software Engineering',
      supervisor: 'Max Mustermann',
      email: 'max.mustermann@techcorp.de',
      address: 'Musterstraße 123, 10115 Berlin',
      phone: '+49 30 12345678'
    }
  });

  console.log('Praxis Partner upserted:', partner);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
