import { z } from 'zod';

export const signupinput = z.object({
    name: z.string().nonempty('Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const signininput = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().nonempty('Password is required'),
});

export const createBlogInput = z.object({
    title: z.string().nonempty('Title is required'),
    content: z.string().nonempty('Content is required'),
});

export const updateBlogInput = z.object({
    title: z.string().nonempty('Title is required'),
    content: z.string().nonempty('Content is required'),
    id: z.number().int('ID must be an integer'),
});

export type SignupInput = z.infer<typeof signupinput>;
export type SigninInput = z.infer<typeof signininput>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
