import z from "zod";

export const User = z.object({
  id: z.number(),
  username: z.string(),
  score: z.number(),
});

export type User = z.infer<typeof User>;
