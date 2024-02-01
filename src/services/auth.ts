import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
} from 'aws-lambda';
import jwkToPem, { JWK } from 'jwk-to-pem';
import { Jwt, JwtPayload, decode } from 'jsonwebtoken';

import { getJwksClient } from '../libs/jwks-client';
import { AuthError } from '../libs/errors';

const fetchCognitoPublicKey = async (kid: string) => {
  const region = 'eu-west-2';
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

  const jwksClient = getJwksClient({ jwksUri: url });
  const keys = await jwksClient.getKeys();
  const key = (
    keys as Array<{
      alg: string;
      e: string;
      kid: string;
      kty: string;
      n: string;
      use: string;
    }>
  ).find((k) => k.kid === kid);

  return jwkToPem(key as JWK);
};

export const verifyToken = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  console.log('Authorisation event received: ', JSON.stringify(event));

  const token = event.authorizationToken.split(' ')[1];

  try {
    const decoded: Jwt | null = decode(token, {
      complete: true,
    });

    await fetchCognitoPublicKey(String(decoded?.header.kid));

    return {
      principalId: String((decoded?.payload as JwtPayload).sub),
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn,
          },
        ],
      },
    };
  } catch (err) {
    console.error('There was an error authenticating user: ', err);

    throw new AuthError('Unauthorised');
  }
};
