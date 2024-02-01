import {
  Handler,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from 'aws-lambda';
import middy from '@middy/core';

import { verifyToken } from '../services/auth';

const verify = async (event: APIGatewayTokenAuthorizerEvent) =>
  verifyToken(event);
export const verifyHandler: Handler = middy<
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult
>().handler(verify);
