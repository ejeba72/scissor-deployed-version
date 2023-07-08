import { z } from "zod";

const ZSignupSchema = z.object({
    firstName: z
        .string({ required_error: 'First name is required' })
        .max(50, 'First name must be 50 characters or less')
        .trim(),
    lastName: z
        .string({ required_error: 'Last name is required' })
        .max(50, 'Last name must be 50 characters or less')
        .trim(),
    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .toLowerCase()
        .email({ message: 'Email address is invalid' }),
    username: z
        .string({ required_error: 'Username is required' })
        .trim()
        .toLowerCase(),
    password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be 8 or more characters '),
});

export { ZSignupSchema, };