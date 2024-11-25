import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

const top5Controller = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/top5",
    {
      schema: {
        response: {
          200: z.object({
            users: z.array(
              z.object({
                username: z.string(),
                score: z.number(),
              })
            ),
          }),
          500: app.httpErrors.internalServerError,
        },
      },
    },
    async function (request, reply) {
      try {
        const topUsers = await fetchTopUsers(app);

        return reply.status(200).send({
          users: topUsers,
        });
      } catch (error: unknown) {
        console.error("Error:", error);

        return app.httpErrors.internalServerError(
          "Failed to retrieve top users"
        );
      }
    }
  );
};

const fetchTopUsers = async (app: FastifyInstance) => {
  return app.db
    .selectFrom("users")
    .select(["username", "score"])
    .orderBy("score", "desc")
    .limit(5)
    .execute();
};

export default top5Controller;
