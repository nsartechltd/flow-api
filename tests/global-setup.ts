import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import { getPrismaClient } from '../src/libs/prisma-client';

module.exports = async function () {
  // Start services that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');

  process.env.DATABASE_URL =
    'postgresql://postgres:password@localhost:5432/flow';
  process.env.NODE_ENV = 'development';

  await seedDatabase();
  await login();
};

const login = async () => {
  console.log('Logging in...');

  const client = new CognitoIdentityProviderClient({ region: 'eu-west-2' });
  const command = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: String(process.env.COGNITO_TEST_USER_USERNAME),
      PASSWORD: String(process.env.COGNITO_TEST_USER_PASSWORD),
    },
    ClientId: process.env.COGNITO_CLIENT_ID,
  });

  try {
    const response = await client.send(command);

    process.env.LOGIN_TOKEN = String(response.AuthenticationResult?.IdToken);

    console.log('Logged in.');
  } catch (err) {
    console.log('Login failed!', err);
  }
};

const seedDatabase = async () => {
  console.log('Seeding database...');

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

    console.log('Database seeded.');
  } catch (err) {
    console.error('Failed to seed database!', err);
  }
};
