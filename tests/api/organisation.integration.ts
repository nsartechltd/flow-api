import supertest, { SuperTest, Test as STest } from 'supertest';

describe('Organisation API', () => {
  let request: SuperTest<STest>;
  let token: string;

  beforeAll(async () => {
    request = supertest('http://0.0.0.0:3000/local');
    token = process.env.LOGIN_TOKEN ?? '';
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
