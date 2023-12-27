import { APIGatewayProxyResult } from 'aws-lambda';
import { Event } from '@middy/http-json-body-parser';
import { z } from 'zod';

import { getStripeClient } from '../libs/stripe-client';
import { getPrismaClient } from '../libs/prisma-client';
import { createSessionSchema } from '../libs/validation/schemas/stripe';

export type CheckoutSessionPayload = z.infer<
  typeof createSessionSchema
>['body'];

export const handleStripeWebhook = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  console.log('Event received: ', JSON.stringify(event));

  const { body } = event;

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
  };

  return response;
};

export const handleCheckoutSession = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  console.log('Event received: ', JSON.stringify(event));

  const stripe = getStripeClient();
  const prisma = getPrismaClient();

  const body: CheckoutSessionPayload = event.body as CheckoutSessionPayload;

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
  };

  const flowAppUrl = process.env.FLOW_APP_URL;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: body.priceId,
          quantity: 1,
        },
      ],
      ui_mode: 'embedded',
      return_url: `${flowAppUrl}/checkout?session_id={CHECKOUT_SESSION_ID}`,
    });

    response.statusCode = session.lastResponse.statusCode;
    response.body = JSON.stringify(session);
  } catch (err: any) {
    console.error('Error creating session on Stripe', err);

    response.statusCode = err.lastResponse.statusCode ?? 500;
    response.body = JSON.stringify({
      error: 'There was a problem creating the session on Stripe',
    });
  }

  return response;
};
