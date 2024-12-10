import { z } from "zod";

export const post = z.object({
  title: z.string(),
  content: z.string(),
});

export type postType = z.infer<typeof post>;
