import supertest, { SuperTest, Test as STest } from 'supertest';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

describe('Organisation API', () => {
  let request: SuperTest<STest>;
  let token: string;

  beforeAll(async () => {
    request = supertest('http://0.0.0.0:3000/local');

    const client = new CognitoIdentityProviderClient({ region: 'eu-west-2' });
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: String(process.env.COGNITO_TEST_USER_USERNAME),
        PASSWORD: String(process.env.COGNITO_TEST_USER_PASSWORD),
      },
      ClientId: process.env.COGNITO_CLIENT_ID,
    });

    try {
      const response = await client.send(command);

      token = String(response.AuthenticationResult?.IdToken);
    } catch (err) {
      console.log(err);
    }
  });

  describe('POST /organisations', () => {
    it('should create an organisation', async () => {
      const response = await request
        .post('/organisations')
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name: 'Example Organisation',
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        id: expect.any(String),
        name: 'Example Organisation',
        stripeSubscriptionId: null,
        vatRegistrationNumber: null,
      });
    });
  });
});
