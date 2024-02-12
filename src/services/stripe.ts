import { APIGatewayProxyResult } from 'aws-lambda';
import { Event } from '@middy/http-json-body-parser';
import { z } from 'zod';

import { getStripeClient } from '../libs/stripe-client';
import {
  createSessionSchema,
  getSessionSchema,
} from '../libs/validation/schemas/stripe';
import { headers } from '../libs/headers';
import { checkoutSessionCompleted } from './stripe-webhooks/checkout-session-completed';
import { chargeSucceeded } from './stripe-webhooks/charge-succeeded';

export type CreateSessionPayload = z.infer<typeof createSessionSchema>['body'];
export type GetSessionPayload = z.infer<
  typeof getSessionSchema
>['pathParameters'];

export enum StripeWebhookTypes {
  CheckoutSessionCompleted = 'checkout.session.completed',
  ChargeSucceeded = 'charge.succeeded',
}

export const handleStripeWebhook = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  console.log('[stripeService] Event received: ', JSON.stringify(event));

  // @ts-expect-error 'type' does exist
  switch (event.body.type) {
    case StripeWebhookTypes.CheckoutSessionCompleted:
      return await checkoutSessionCompleted(event);
    case StripeWebhookTypes.ChargeSucceeded:
      return await chargeSucceeded(event);
    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Webhook type is not supported' }),
      };
  }
};

export const handleCreateSession = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  console.log('[stripeService] Event received: ', JSON.stringify(event));

  const stripe = getStripeClient();

  const body: CreateSessionPayload = event.body as CreateSessionPayload;

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
    headers: headers(),
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
      return_url: `${flowAppUrl}/subscription-status?session_id={CHECKOUT_SESSION_ID}&price_id=${body.priceId}`,
      subscription_data: {
        trial_period_days: 7,
      },
      customer_email: body.email,
    });

    response.statusCode = session.lastResponse.statusCode;
    response.body = JSON.stringify(session);
  } catch (err) {
    console.error('[stripeService] Error creating session on Stripe', err);

    response.statusCode = 500;
    response.body = JSON.stringify({
      error: 'There was a problem creating the session on Stripe',
    });
  }

  return response;
};

export const handleGetSession = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  console.log('[stripeService] Event received: ', JSON.stringify(event));

  const params: GetSessionPayload = event.pathParameters as GetSessionPayload;

  const stripe = getStripeClient();

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
    headers: headers(),
  };

  try {
    const session = await stripe.checkout.sessions.retrieve(params.sessionId);

    console.log('[stripeService] Session found: ', JSON.stringify(session));

    const responseBody = {
      status: session.status,
      paymentStatus: session.payment_status,
      customerEmail: '',
    };

    if (session.customer) {
      const customer = await stripe.customers.retrieve(
        String(session.customer)
      );
      // @ts-expect-error customer email DOES exist on the stripe.customers.retrieve request
      responseBody.customerEmail = customer.email;
    }

    response.statusCode = session.lastResponse.statusCode;
    response.body = JSON.stringify(responseBody);
  } catch (err) {
    console.error('[stripeService] Error creating session on Stripe', err);

    response.statusCode = 500;
    response.body = JSON.stringify({
      error: 'There was a problem retrieving the session from Stripe',
    });
  }

  return response;
};
