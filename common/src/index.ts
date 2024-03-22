import { z } from "zod";


export const signupinput = z.object({
  
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});
export const signininput = z.object({
  
    
    email: z.string().email(),
    password: z.string().min(6),
  });

export type SignupInput = z.infer<typeof signupinput>;
export type SigninInput = z.infer<typeof signininput>;

export const createBlogInput = z.object({
  title: z.string(),
  content: z.string()
});
export type CreateBlogInput = z.infer<typeof createBlogInput>;

export const updateBlogInput = z.object({
    title: z.string(),
    content: z.string(),
    id:z.number()
  });
  export type UpdateBlogInput = z.infer<typeof updateBlogInput>;