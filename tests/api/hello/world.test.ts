import supertest from 'supertest';

const request = supertest('http://0.0.0.0:3000/dev');

describe('Hello World', () => {
  it('should return a hello world response', async () => {
    const response = await request.get('/api/hello-world');

    expect(response.body).toEqual({
      message: 'Hello, World!',
    });
    expect(response.statusCode).toEqual(200);
  });
});
