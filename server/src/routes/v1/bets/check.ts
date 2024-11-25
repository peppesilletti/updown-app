import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { fetchCurrentBTCPrice } from "../../../lib/fetchCurrentBTCPrice";

const checkController = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/check",
    {
      schema: {
        body: z.object({
          betId: z.number(),
        }),
        response: {
          200: z.object({
            betResult: z.object({
              status: z.enum(["won", "lost", "pending"]),
              newUserScore: z.number().optional(),
            }),
          }),
          400: app.httpErrors.badRequest,
          404: app.httpErrors.notFound,
          500: app.httpErrors.internalServerError,
        },
      },
    },
    async function (request, reply) {
      const { betId } = request.body;

      try {
        const bet = await getBet(app, betId);

        if (!bet) {
          return app.httpErrors.notFound("Bet not found");
        }

        if (bet.status !== "pending") {
          return app.httpErrors.badRequest("Bet is already resolved");
        }

        await updateLastCheckedAt(app, betId);

        const currentPrice = await fetchCurrentBTCPrice();

        if (currentPrice === parseFloat(bet.btc_price)) {
          await handlePendingBet(app, betId);

          return reply.status(200).send({
            betResult: {
              status: "pending",
            },
          });
        }

        const isSuccessful = determineBetOutcome(bet, currentPrice);

        const transactionResult = await resolveBetTransaction(
          app,
          betId,
          isSuccessful,
          bet.user_id
        );

        return reply.status(200).send({
          betResult: {
            status: isSuccessful ? "won" : "lost",
            newUserScore: transactionResult.updatedUser.score,
          },
        });
      } catch (error) {
        console.error("Error resolving bet:", error);
        return app.httpErrors.internalServerError(
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }
  );
};

async function getBet(app: FastifyInstance, betId: number) {
  return app.db
    .selectFrom("bets")
    .selectAll()
    .where("id", "=", betId)
    .executeTakeFirst();
}

async function updateLastCheckedAt(app: FastifyInstance, betId: number) {
  return app.db
    .updateTable("bets")
    .set({
      last_checked_at: new Date().toISOString(),
    })
    .where("id", "=", betId)
    .execute();
}

function determineBetOutcome(bet: any, currentPrice: number) {
  return (
    (bet.direction === "UP" && currentPrice > parseFloat(bet.btc_price)) ||
    (bet.direction === "DOWN" && currentPrice < parseFloat(bet.btc_price))
  );
}

async function handlePendingBet(app: FastifyInstance, betId: number) {
  if (process.env.NODE_ENV !== "test" && !process.env.CI) {
    if (
      !process.env.BETS_CHECK_URL ||
      !process.env.BETS_CHECK_INTERVAL_SECONDS
    ) {
      return app.log.error(
        "BETS_CHECK_URL or BETS_CHECK_INTERVAL_SECONDS is not set"
      );
    }

    await app.taskScheduler.schedule({
      payload: { betId },
      inSeconds: parseInt(process.env.BETS_CHECK_INTERVAL_SECONDS),
      url: process.env.BETS_CHECK_URL,
    });
  }
}

async function resolveBetTransaction(
  app: FastifyInstance,
  betId: number,
  isSuccessful: boolean,
  userId: number
) {
  return app.db.transaction().execute(async (trx) => {
    const updatedBet = await trx
      .updateTable("bets")
      .set({
        status: isSuccessful ? "won" : "lost",
      })
      .where("id", "=", betId)
      .returningAll()
      .executeTakeFirstOrThrow();

    const updatedUser = await trx
      .updateTable("users")
      .set((eb) =>
        isSuccessful
          ? {
              score: eb("score", "+", 1),
            }
          : {
              score: eb("score", "-", 1),
            }
      )
      .where("id", "=", userId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return {
      updatedBet,
      updatedUser,
    };
  });
}

export default checkController;
