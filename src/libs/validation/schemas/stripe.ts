import z from 'zod';

export const createSessionSchema = z.object({
  body: z.object({
    priceId: z.string({
      required_error: 'Price ID is required',
      invalid_type_error: 'Price IDs must be a string',
    }),
  }),
});
