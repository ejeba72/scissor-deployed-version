"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZSignupSchema = void 0;
const zod_1 = require("zod");
const ZSignupSchema = zod_1.z.object({
    firstName: zod_1.z
        .string({ required_error: 'First name is required' })
        .max(50, 'First name must be 50 characters or less')
        .trim(),
    lastName: zod_1.z
        .string({ required_error: 'Last name is required' })
        .max(50, 'Last name must be 50 characters or less')
        .trim(),
    email: zod_1.z
        .string({ required_error: 'Email is required' })
        .trim()
        .toLowerCase()
        .email({ message: 'Email address is invalid' }),
    username: zod_1.z
        .string({ required_error: 'Username is required' })
        .trim()
        .toLowerCase(),
    password: zod_1.z
        .string({ required_error: 'Password is required' })
        .min(8, 'Password must be 8 or more characters '),
});
exports.ZSignupSchema = ZSignupSchema;
