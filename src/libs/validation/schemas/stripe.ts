import z from 'zod';

export const createSessionSchema = z.object({
  body: z.object({
    priceId: z.string({
      required_error: 'Price ID is required',
      invalid_type_error: 'Price ID must be a string',
    }),
    email: z.string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    }),
  }),
});

export const getSessionSchema = z.object({
  pathParameters: z.object({
    sessionId: z.string({
      required_error: 'Session ID is required',
      invalid_type_error: 'Session ID must be a string',
    }),
  }),
});
