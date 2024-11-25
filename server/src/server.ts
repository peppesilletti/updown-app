import dotenvFlow from "dotenv-flow";
import Fastify, { FastifyInstance } from "fastify";
import { app as AppPlugin } from "./app";

dotenvFlow.config();

// Instantiate Fastify with some config
const app: FastifyInstance = Fastify({
  logger: true,
  pluginTimeout: 10000,
});

// Register your application as a normal plugin.
app.register(AppPlugin);

// Start listening.
app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  })
  .then(() => {
    app.log.info(`Server is running on port ${process.env.PORT}`);
  });
