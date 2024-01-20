import middy from '@middy/core';

import { AuthError } from '../libs/errors';
import { getStripeClient } from '../libs/stripe-client';
import config from '../config';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const stripeWebhookVerifier = (): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> => {
  const before: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > = async ({ event }) => {
    try {
      const stripeSignature = event.headers['Stripe-Signature'];

      if (!stripeSignature) {
        throw new AuthError(
          'No stripe signature present. Ignoring this event.'
        );
      }

      const webhookSecret = String(config.stripe.webhookSecret);

      const stripe = getStripeClient();

      const body = JSON.parse(event.body ?? '{}');

      stripe.webhooks.constructEvent(
        JSON.stringify(body, null, 2),
        stripeSignature,
        webhookSecret
      );
    } catch (err) {
      console.error('Error verifying Stripe webhook', err);

      // Return the initial AWS request ID to help with log searching
      const requestId = event.requestContext.requestId;

      return {
        statusCode: 401,
        body: JSON.stringify({
          error: `Request ID: '${requestId}' - There was a problem handling the Stripe webhook.`,
        }),
      };
    }
  };

  return {
    before,
  };
};
