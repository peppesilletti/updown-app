import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { Bet } from "../../../schemas/bets";

const fetchUserBetsController = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:id/bets",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            bets: z.array(Bet),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
            error: z.string(),
          }),
        },
      },
    },
    async function (request, reply) {
      const { id } = request.params;

      try {
        const bets = await fetchUserBets(app, id);

        return reply.status(200).send({
          bets: bets.map((bet) => ({
            id: bet.id,
            btcPrice: Number(bet.btc_price),
            status: bet.status as "pending" | "won" | "lost",
            userId: bet.user_id,
            createdAt: bet.created_at.toISOString(),
            lastCheckedAt: bet.last_checked_at?.toISOString() || null,
            direction: bet.direction as "UP" | "DOWN",
          })),
        });
      } catch (error: unknown) {
        console.error("Error fetching bets:", error);
        return app.httpErrors.internalServerError("Failed to fetch bets");
      }
    }
  );
};

const fetchUserBets = async (app: FastifyInstance, userId: string) => {
  return app.db
    .selectFrom("bets")
    .selectAll()
    .where("user_id", "=", Number(userId))
    .execute();
};

export default fetchUserBetsController;
