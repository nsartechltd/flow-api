import { getPrismaClient } from '../src/libs/prisma-client';

module.exports = async function () {
  // Start services that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');

  process.env.DATABASE_URL =
    'postgresql://postgres:password@localhost:5432/flow';
  process.env.NODE_ENV = 'development';

  await seedDatabase();
};

const seedDatabase = async () => {
  console.log(`Seeding database...`);

  const prisma = getPrismaClient();

  try {
    const org = await prisma.organisation.create({
      data: { name: 'Example Ltd' },
    });
    await prisma.user.create({
      data: {
        firstName: 'Some',
        lastName: 'One',
        email: 'some.one@email.com',
        birthdate: '01/01/1993',
        cognitoId: 'some-cognito-id',
        organisationId: org.id,
      },
    });
  } catch (err) {
    console.error('An error occurred:', err);
  }

  console.log('Database seeded.');
};
