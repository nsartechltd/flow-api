import supertest, { SuperTest, Test as STest } from 'supertest';

describe('Organisation API', () => {
  let request: SuperTest<STest>;

  beforeAll(() => {
    request = supertest('http://0.0.0.0:3000/dev');
  });

  describe('POST /organisations', () => {
    it('should create an organisation', async () => {
      const response = await request.post('/organisations').send({
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
