import { PostConfirmationTriggerEvent } from 'aws-lambda';

import { getPrismaClient } from '../libs/prisma-client';

export const storeUser = async (event: PostConfirmationTriggerEvent) => {
  console.log('[userService] Event received: ', JSON.stringify(event));

  const prisma = getPrismaClient();

  const { userAttributes: attributes } = event.request;

  try {
    const orgName = attributes['custom:organisation'];

    const organisation = await prisma.organisation.create({
      data: {
        name: orgName,
      },
    });

    await prisma.user.create({
      data: {
        organisationId: organisation.id,
        firstName: attributes.given_name,
        lastName: attributes.family_name,
        email: attributes.email,
        birthdate: attributes.birthdate,
        cognitoId: attributes.sub,
      },
    });
  } catch (err) {
    console.error(
      '[userService] There was a problem storing the user in the database',
      err
    );
  }

  return event;
};
