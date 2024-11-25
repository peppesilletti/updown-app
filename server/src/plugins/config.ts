import fp from "fastify-plugin";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  GOOGLE_CLOUD_PROJECT: z.string(),
  GOOGLE_CLOUD_LOCATION: z.string(),
  GOOGLE_CLOUD_QUEUE: z.string(),
});

const env = envSchema.parse(process.env);

const config = {
  nodeEnv: env.NODE_ENV,
  db: {
    host: env.POSTGRES_HOST,
    port: parseInt(env.POSTGRES_PORT),
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
  },
  googleCloudTasks: {
    project: env.GOOGLE_CLOUD_PROJECT,
    location: env.GOOGLE_CLOUD_LOCATION,
    queue: env.GOOGLE_CLOUD_QUEUE,
  },
};

declare module "fastify" {
  interface FastifyInstance {
    config: typeof config;
  }
}

export default fp(async (fastify) => {
  fastify.decorate("config", config);
});
