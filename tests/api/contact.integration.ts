import supertest, { SuperTest, Test as STest } from 'supertest';

describe('Contact API', () => {
  let request: SuperTest<STest>;
  let token: string;

  beforeAll(() => {
    request = supertest('http://0.0.0.0:3000/local');
    token = process.env.LOGIN_TOKEN ?? '';
  });

  describe('POST /contacts', () => {
    it('should throw a 400 if the payload is wrong', async () => {
      const response = await request
        .post('/contacts')
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name: 1234,
        });

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        issues: [
          {
            code: 'invalid_type',
            expected: 'string',
            message: 'Name must be a string',
            path: ['body', 'name'],
            received: 'number',
          },
        ],
        name: 'ZodError',
      });
    });

    it('should create a contact', async () => {
      const response = await request
        .post('/contacts')
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name: 'GitHub Inc.',
          companyRegNumber: '123456',
          website: 'https://github.com',
          people: [
            {
              firstName: 'Bill',
              lastName: 'Gates',
              includeInEmails: true,
              email: 'bill.gates@microsoft.com',
            },
          ],
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        id: expect.any(String),
        name: 'GitHub Inc.',
        companyRegNumber: '123456',
        website: 'https://github.com',
        people: [
          {
            id: expect.any(String),
            firstName: 'Bill',
            lastName: 'Gates',
            includeInEmails: true,
            email: 'bill.gates@microsoft.com',
            contactId: expect.any(String),
          },
        ],
      });
    });
  });
});
