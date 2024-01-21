import { APIGatewayProxyResult } from 'aws-lambda';
import { Event } from '@middy/http-json-body-parser';
import Stripe from 'stripe';

import { BadRequestError, NotFoundError } from '../../libs/errors';
import { getPrismaClient } from '../../libs/prisma-client';

export const checkoutSessionCompleted = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  const body: Stripe.CheckoutSessionCompletedEvent =
    event.body as unknown as Stripe.CheckoutSessionCompletedEvent;

  console.log(
    '[checkoutSessionCompletedWebhook] Event body: ',
    JSON.stringify(body)
  );

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
  };

  try {
    const customerEmail = body.data.object.customer_details?.email;

    console.log(
      '[checkoutSessionCompletedWebhook] Customer email: ',
      customerEmail
    );

    if (!customerEmail) {
      throw new BadRequestError(
        `No 'customer_email' was present in the the webhook body. Unable to start user subscription.`
      );
    }

    const prisma = getPrismaClient();

    const user = await prisma.user.findFirst({
      where: {
        email: customerEmail,
      },
      include: {
        organisation: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User was not found, retry webhook.');
    }

    console.log('[checkoutSessionCompletedWebhook] User found: ', user);

    const organisation = await prisma.organisation.update({
      where: {
        id: user.organisation.id,
      },
      data: {
        stripeSubscriptionId: String(body.data.object.subscription),
      },
    });

    console.log(
      '[checkoutSessionCompletedWebhook] Organisation updated: ',
      organisation
    );

    response.body = JSON.stringify({ success: true });
  } catch (err) {
    console.error(
      '[checkoutSessionCompletedWebhook] Error handling Stripe webhook: ',
      err
    );
    response.statusCode = 500;

    if (
      err instanceof NotFoundError ||
      err instanceof BadRequestError ||
      err instanceof Stripe.errors.StripeSignatureVerificationError
    ) {
      response.statusCode = Number(err.statusCode);
    }

    // Return the initial AWS request ID to help with log searching
    const requestId = event.requestContext.requestId;

    response.body = JSON.stringify({
      error: `Request ID: '${requestId}' - There was a problem handling the Stripe webhook.`,
    });
  }

  return response;
};
