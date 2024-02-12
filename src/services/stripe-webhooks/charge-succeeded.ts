import { APIGatewayProxyResult } from 'aws-lambda';
import { Event } from '@middy/http-json-body-parser';

export const chargeSucceeded = async (
  event: Event
): Promise<APIGatewayProxyResult> => {
  console.log('[chargeSucceededWebhook] Event received: ', event);

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
  };

  return response;
};
