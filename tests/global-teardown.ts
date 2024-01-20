import { getPrismaClient } from '../src/libs/prisma-client';

module.exports = async function () {
  // Start services that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');

  process.env.DATABASE_URL =
    'postgresql://postgres:password@localhost:5432/flow';
  process.env.NODE_ENV = 'development';

  await clearDatabase();
};

const clearDatabase = async () => {
  console.log(`Clearing database...`);

  const prisma = getPrismaClient();

  try {
    await prisma.user.deleteMany();
    await prisma.organisation.deleteMany();
  } catch (err) {
    console.error('An error occurred:', err);
  }

  console.log('Database cleared.');
};
