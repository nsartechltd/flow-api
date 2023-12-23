import { APIGatewayProxyResult } from 'aws-lambda';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { Event } from '@middy/http-json-body-parser';

import { createOrganisationSchema } from '../libs/validation';

const prisma = new PrismaClient();

export type OrganisationPayload = z.infer<
  typeof createOrganisationSchema
>['body'];

export const createOrganisation = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  console.log('Event received: ', event);

  const body: OrganisationPayload = event.body as OrganisationPayload;

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
  };

  try {
    const organisation = await prisma.organisation.create({
      data: {
        name: body.name,
      },
    });

    response.body = JSON.stringify(organisation);
  } catch (err: any) {
    console.error('Error creating organisation', err.message);

    response.statusCode = 500;
    response.body = JSON.stringify({
      error: 'There was a problem creating the organisation',
    });
  }

  return response;
};
