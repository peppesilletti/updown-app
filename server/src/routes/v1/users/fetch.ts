import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { User } from "../../../schemas/users"; // Assuming you have a User schema

const fetchByIdController = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
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
      const { id } = request.params;

      try {
        const user = await fetchUserById(app, id);

        if (!user) {
          return app.httpErrors.notFound("User not found");
        }

        return reply.status(200).send({
          user,
        });
      } catch (error: unknown) {
        console.error("Error fetching user:", error);
        return app.httpErrors.internalServerError("Failed to fetch user");
      }
    }
  );
};

const fetchUserById = async (app: FastifyInstance, id: string) => {
  return app.db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", parseInt(id))
    .executeTakeFirst();
};

export default fetchByIdController;
