import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import middy from '@middy/core';
import jsonBodyParser, { Event } from '@middy/http-json-body-parser';

import { handleStripeWebhook, handleCheckoutSession } from '../services/stripe';

const stripeWebhook = async (event: Event) => handleStripeWebhook(event);
export const webhookHandler: Handler = middy<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>()
  .use(jsonBodyParser())
  .handler(stripeWebhook);

const checkoutSession = async (event: Event) => handleCheckoutSession(event);
export const checkoutSessionHandler: Handler = middy<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>()
  .use(jsonBodyParser())
  .handler(checkoutSession);
