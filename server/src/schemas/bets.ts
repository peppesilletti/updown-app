import z from "zod";

export const Bet = z.object({
  id: z.number(),
  userId: z.number(),
  btcPrice: z.number(),
  direction: z.enum(["UP", "DOWN"]),
  status: z.enum(["pending", "won", "lost"]),
  createdAt: z.string(),
  lastCheckedAt: z.string().nullable(),
});

export type Bet = z.infer<typeof Bet>;
