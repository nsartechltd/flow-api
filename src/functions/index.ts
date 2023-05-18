import type { APIGatewayEvent } from 'aws-lambda';

export const helloWorld = async (event: APIGatewayEvent) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello, World!',
    }),
  };
};
