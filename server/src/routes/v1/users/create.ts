import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

const createUserController = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/create",
    {
      schema: {
        body: z.object({
          username: z
            .string()
            .min(3, "Username must be at least 3 characters."),
        }),
        response: {
          200: z.object({
            message: z.string(),
            createdUser: z.any(),
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
        const existingUser = await checkUserExists(app, username);

        if (existingUser) {
          return app.httpErrors.badRequest("Username already exists");
        }

        const createdUser = await createUser(app, username);

        return reply.status(201).send({
          message: "User created successfully!",
          createdUser,
        });
      } catch (error: unknown) {
        console.error("Error:", error);

        return app.httpErrors.internalServerError(
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }
  );
};

const checkUserExists = async (app: FastifyInstance, username: string) => {
  return app.db
    .selectFrom("users")
    .selectAll()
    .where("username", "=", username)
    .executeTakeFirst();
};

const createUser = async (app: FastifyInstance, username: string) => {
  return app.db
    .insertInto("users")
    .values({
      username,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
};

export default createUserController;
