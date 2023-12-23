import {
  Handler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import middy from '@middy/core';
import jsonBodyParser, { Event } from '@middy/http-json-body-parser';

import { createOrganisation } from '../services/organisation';
import { createOrganisationSchema, validator } from '../libs/validation';

const postOrganisation = async (event: Event) => createOrganisation(event);
export const createHandler: Handler = middy<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>()
  .use(jsonBodyParser())
  .use(validator(createOrganisationSchema))
  .handler(postOrganisation);
