import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import middy from '@middy/core';
import jsonBodyParser, { Event } from '@middy/http-json-body-parser';

import { createContact } from '../services/contact';
import { createContactSchema, validator } from '../libs/validation';

const postContact = async (event: Event) => createContact(event);
export const createContactHandler: Handler = middy<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>()
  .use(jsonBodyParser())
  .use(validator(createContactSchema))
  .handler(postContact);
