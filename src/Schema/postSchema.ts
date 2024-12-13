import { z } from "zod";

export const post = z.object({
  title: z.string(),
  content: z.string().optional(),
});

export type postType = z.infer<typeof post>;
