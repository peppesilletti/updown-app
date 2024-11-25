import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";

import { FastifyPluginAsync, FastifyServerOptions } from "fastify";
import path, { join } from "path";

import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

// Set the environment variable for authentication
if (process.env.NODE_ENV === "development") {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
    __dirname,
    "../gcp-service-account.json"
  );
}

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!
  await fastify.register(fastifyCors, {
    origin: "*",
  });

  await fastify.register(fastifyRateLimit, {
    global: true,
    max: 100,
    timeWindow: "1 minute",
  });

  await fastify.register(fastifyHelmet);

  // Add schema validator and serializer
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: { forceESM: true },
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: { prefix: "/api", forceESM: true },
  });
};

export default app;
export { app };
