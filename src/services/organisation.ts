import { APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';
import { Event } from '@middy/http-json-body-parser';

import { createOrganisationSchema } from '../libs/validation';
import { getPrismaClient } from '../libs/prisma-client';
import { headers } from '../libs/headers';

export type OrganisationPayload = z.infer<
  typeof createOrganisationSchema
>['body'];

export const createOrganisation = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  console.log('[organisationService] Event received: ', JSON.stringify(event));

  const prisma = getPrismaClient();

  const body: OrganisationPayload = event.body as OrganisationPayload;

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
    headers: headers(),
  };

  try {
    const organisation = await prisma.organisation.create({
      data: {
        name: body.name,
      },
    });

    response.body = JSON.stringify(organisation);
  } catch (err) {
    console.error('[organisationService] Error creating organisation', err);

    response.statusCode = 500;
    response.body = JSON.stringify({
      error: 'There was a problem creating the organisation',
    });
  }

  return response;
};
