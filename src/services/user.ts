import { PostConfirmationTriggerEvent } from 'aws-lambda';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const storeUser = async (event: PostConfirmationTriggerEvent) => {
  console.log('Event received: ', event);

  const { userAttributes: attributes } = event.request;

  const organisation = await prisma.organisation.findFirst({
    where: {
      name: attributes['custom:organisation'],
    },
  });

  if (!organisation) {
    console.error(
      `Organisation with name: '${attributes['custom:organisation']}' could not be found. User was not added to the database.`
    );

    return event;
  }

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

  return event;
};
