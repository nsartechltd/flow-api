import { APIGatewayProxyResult } from 'aws-lambda';
import { Event } from '@middy/http-json-body-parser';
import { z } from 'zod';
import Stripe from 'stripe';

import { getStripeClient } from '../libs/stripe-client';
import { getPrismaClient } from '../libs/prisma-client';
import {
  createSessionSchema,
  getSessionSchema,
} from '../libs/validation/schemas/stripe';

export type CreateSessionPayload = z.infer<typeof createSessionSchema>['body'];
export type GetSessionPayload = z.infer<
  typeof getSessionSchema
>['pathParameters'];

export const handleStripeWebhook = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  console.log('Event received: ', JSON.stringify(event));

  const prisma = getPrismaClient();

  const body: Stripe.CheckoutSessionCompletedEvent =
    event.body as unknown as Stripe.CheckoutSessionCompletedEvent;

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
  };

  try {
    const organisationCustomField = body.data.object.custom_fields.find(
      (field) => field.key === 'organisation'
    );

    if (!organisationCustomField) {
      console.error(
        `No 'organisation' custom field was present in the webhook body. Unable to onboard the organisation.`
      );

      return response;
    }

    const organisation = await prisma.organisation.create({
      data: {
        name: String(organisationCustomField.text?.value),
        stripeSubscriptionId: String(body.data.object.subscription),
      },
    });

    console.log('Organisation created', organisation.id);

    const customerEmail = body.data.object.customer_details?.email;

    if (!customerEmail) {
      console.error(
        `No 'customer_email' was present in the the webhook body. Unable to signup the user.`
      );

      return response;
    }

    const user = await prisma.user.create({
      data: {
        email: customerEmail,
        organisationId: organisation.id,
      },
    });

    console.log('User created', user.id);
  } catch (err: any) {
    console.error('Error creating session on Stripe', err);

    response.statusCode = 500;
    response.body = JSON.stringify({
      error: 'There was a problem creating the session on Stripe',
    });
  }

  return response;
};

export const handleCreateSession = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  console.log('Event received: ', JSON.stringify(event));

  const stripe = getStripeClient();

  const body: CreateSessionPayload = event.body as CreateSessionPayload;

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
      return_url: `${flowAppUrl}/subscription-status?session_id={CHECKOUT_SESSION_ID}&price_id=${body.priceId}`,
      subscription_data: {
        trial_period_days: 7,
      },
      customer_email: body.email,
    });

    response.statusCode = session.lastResponse.statusCode;
    response.body = JSON.stringify(session);
  } catch (err: any) {
    console.error('Error creating session on Stripe', err);

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
  console.log('Event received: ', JSON.stringify(event));

  const params: GetSessionPayload = event.pathParameters as GetSessionPayload;

  const stripe = getStripeClient();

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
  };

  try {
    const session = await stripe.checkout.sessions.retrieve(params.sessionId);

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
  } catch (err: any) {
    console.error('Error creating session on Stripe', err);

    response.statusCode = 500;
    response.body = JSON.stringify({
      error: 'There was a problem retrieving the session from Stripe',
    });
  }

  return response;
};
