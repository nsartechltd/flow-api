import supertest, { SuperTest, Test as STest } from 'supertest';

import { getStripeClient } from '../../src/libs/stripe-client';
import config from '../../src/config';

describe('Stripe API', () => {
  let request: SuperTest<STest>;

  beforeAll(() => {
    request = supertest('http://0.0.0.0:3000/local');
  });

  describe('GET /stripe/session/{sessionId}', () => {
    it('should retrieve a stripe session', async () => {
      const sessionId =
        'cs_test_a1TOcx8EBDVjghyfDK6wfzmeZgmnNeRqAI391cgum1DbScdSuBc1s9bRdK';

      const response = await request.get(`/stripe/session/${sessionId}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        customerEmail: expect.any(String),
        paymentStatus: 'paid',
        status: 'complete',
      });
    });
  });

  describe('POST /stripe/webhook', () => {
    it('should throw a 401 if signature is wrong', async () => {
      const eventBody = {
        data: {
          object: {
            customer_details: {
              email: 'some.one@email.com',
            },
            subscription: 'some-sub-id',
          },
        },
        type: 'checkout.session.completed',
      };

      const response = await request
        .post(`/stripe/webhook`)
        .send(eventBody)
        .set('Stripe-Signature', 'wrong-signature');

      expect(response.statusCode).toEqual(401);
      expect(response.body).toEqual({
        error: '',
      });
    });

    it('should handle a stripe webhook', async () => {
      const stripe = getStripeClient();

      const eventBody = {
        data: {
          object: {
            customer_details: {
              email: 'some.one@email.com',
            },
            subscription: 'some-sub-id',
          },
        },
        type: 'checkout.session.completed',
      };

      const signature = stripe.webhooks.generateTestHeaderString({
        payload: JSON.stringify(eventBody, null, 2),
        secret: String(config.stripe.webhookSecret),
      });

      const response = await request
        .post(`/stripe/webhook`)
        .send(eventBody)
        .set('Stripe-Signature', signature);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        success: true,
      });
    });
  });

  describe('POST /stripe/session', () => {
    it('should create a stripe session', async () => {
      const response = await request.post(`/stripe/session`).send({
        email: 'some.one@email.com',
        priceId: 'price_1OPup2CUs9Oi5yjKnCGXj5h9',
      });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          client_secret: expect.stringContaining('cs_test_'),
          customer_email: 'some.one@email.com',
        })
      );
    });
  });
});
