import { z } from "zod";

export const signUpSchema = z.object({
  userName: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const signInSchema = z.object({
  userName: z.string(),
  password: z.string(),
});