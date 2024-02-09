import { APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';
import { Event } from '@middy/http-json-body-parser';

import { createContactSchema } from '../libs/validation';
import { getPrismaClient } from '../libs/prisma-client';
import { headers } from '../libs/headers';

export type ContactPayload = z.infer<typeof createContactSchema>['body'];

export const createContact = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  console.log('Event received: ', JSON.stringify(event));

  const prisma = getPrismaClient();

  const body: ContactPayload = event.body as ContactPayload;

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
    headers: headers(),
  };

  try {
    const contact = await prisma.contact.create({
      data: {
        name: body.name,
      },
    });

    response.body = JSON.stringify(contact);
  } catch (err) {
    console.error('Error creating contact', err);

    response.statusCode = 500;
    response.body = JSON.stringify({
      error: 'There was a problem creating the contact',
    });
  }

  return response;
};
