import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import middy from '@middy/core';
import jsonBodyParser, { Event } from '@middy/http-json-body-parser';

import {
  handleStripeWebhook,
  handleCreateSession,
  handleGetSession,
} from '../services/stripe';
import { validator } from '../libs/validation';
import {
  createSessionSchema,
  getSessionSchema,
} from '../libs/validation/schemas/stripe';
import { stripeWebhookVerifier } from '../middleware/stripe';

const stripeWebhook = async (event: Event) => handleStripeWebhook(event);
export const webhookHandler: Handler = middy<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>()
  .use(stripeWebhookVerifier())
  .use(jsonBodyParser())
  .handler(stripeWebhook);

const createSession = async (event: Event) => handleCreateSession(event);
export const createSessionHandler: Handler = middy<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>()
  .use(jsonBodyParser())
  .use(validator(createSessionSchema))
  .handler(createSession);

const getSession = async (event: Event) => handleGetSession(event);
export const getSessionHandler: Handler = middy<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>()
  .use(validator(getSessionSchema))
  .handler(getSession);
