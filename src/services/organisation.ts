import { APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';
import { Event } from '@middy/http-json-body-parser';

import { createOrganisationSchema } from '../libs/validation';
import { getPrismaClient } from '../libs/prisma-client';

export type OrganisationPayload = z.infer<
  typeof createOrganisationSchema
>['body'];

export const createOrganisation = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  console.log('Event received: ', JSON.stringify(event));

  const prisma = getPrismaClient();

  const body: OrganisationPayload = event.body as OrganisationPayload;

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': '*',
      'Content-Type': 'application/json',
    },
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
