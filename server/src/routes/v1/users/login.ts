import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { User } from "../../../schemas/users"; // Assuming you have a User schema

const fetchByIdController = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/login",
    {
      schema: {
        body: z.object({
          username: z.string(),
        }),
        response: {
          200: z.object({
            user: User,
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
      const { username } = request.body;

      try {
        const user = await fetchUserByUsername(app, username);

        if (!user) {
          return app.httpErrors.notFound("User not found");
        }

        return reply.status(200).send({
          user,
        });
      } catch (error: unknown) {
        console.error("Error fetching user:", error);
        return app.httpErrors.internalServerError(
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }
  );
};

const fetchUserByUsername = async (app: FastifyInstance, username: string) => {
  return app.db
    .selectFrom("users")
    .selectAll()
    .where("username", "=", username)
    .executeTakeFirst();
};

export default fetchByIdController;
