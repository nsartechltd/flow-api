import z from 'zod';

export const createContactPeopleSchema = z.object({
  firstName: z
    .string({
      invalid_type_error: 'First Name must be a string',
    })
    .optional(),
  lastName: z
    .string({
      invalid_type_error: 'Last Name must be a string',
    })
    .optional(),
  email: z
    .string({
      invalid_type_error: 'Email must be a string',
    })
    .email()
    .optional(),
  includeInEmails: z
    .boolean({
      invalid_type_error: 'Include In Emails must be a boolean',
    })
    .default(false)
    .optional(),
});

export const createContactSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    website: z
      .string({
        invalid_type_error: 'Website must be a string',
      })
      .optional(),
    companyRegNumber: z
      .string({
        invalid_type_error: 'Company Registration Number must be a string',
      })
      .optional(),
    people: z.array(createContactPeopleSchema).optional(),
  }),
});
