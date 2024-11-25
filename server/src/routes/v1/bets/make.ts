import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { fetchCurrentBTCPrice } from "../../../lib/fetchCurrentBTCPrice";

const makeController = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/make",
    {
      schema: {
        body: z.object({
          userId: z.number(),
          direction: z.enum(["UP", "DOWN"]),
        }),
        response: {
          200: z.object({
            message: z.string(),
            createdBet: z.any(),
          }),
          500: z.object({
            message: z.string(),
            error: z.string(),
          }),
        },
      },
    },
    async function (request, reply) {
      const { userId, direction } = request.body;

      try {
        const unresolvedBets = await getUnresolvedBets(app, userId);

        if (unresolvedBets.length > 0) {
          return app.httpErrors.unauthorized(
            "You can't bet. You have an unresolved bet."
          );
        }

        const btcPrice = await fetchCurrentBTCPrice();
        const createdBet = await createBet(app, userId, direction, btcPrice);

        await scheduleBetCheck(app, createdBet.id);

        return reply.status(200).send({
          message: "Bet scheduled for checking!",
          createdBet,
        });
      } catch (error: unknown) {
        console.error("Error:", error);

        return reply.status(500).send({
          message: "Failed to save bet or schedule check",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );
};

const getUnresolvedBets = async (app: FastifyInstance, userId: number) => {
  return app.db
    .selectFrom("bets")
    .select("id")
    .where("user_id", "=", userId)
    .where("status", "=", "pending")
    .orderBy("created_at", "desc")
    .limit(1)
    .execute();
};

const createBet = async (
  app: FastifyInstance,
  userId: number,
  direction: string,
  btcPrice: number
) => {
  return await app.db
    .insertInto("bets")
    .values({
      user_id: userId,
      direction,
      btc_price: btcPrice,
      status: "pending",
    })
    .returning("id")
    .executeTakeFirstOrThrow();
};

const scheduleBetCheck = async (app: FastifyInstance, betId: number) => {
  if (process.env.NODE_ENV !== "test" && !process.env.CI) {
    if (
      !process.env.BETS_CHECK_URL ||
      !process.env.BETS_CHECK_INTERVAL_SECONDS
    ) {
      app.log.error("BETS_CHECK_URL or BETS_CHECK_INTERVAL_SECONDS is not set");
      return;
    }

    await app.taskScheduler.schedule({
      payload: { betId },
      inSeconds: parseInt(process.env.BETS_CHECK_INTERVAL_SECONDS),
      url: process.env.BETS_CHECK_URL,
    });
  }
};

export default makeController;
