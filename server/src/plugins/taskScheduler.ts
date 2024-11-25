import fp from "fastify-plugin";
import TaskScheduler from "../lib/taskScheduler";

declare module "fastify" {
  interface FastifyInstance {
    taskScheduler: TaskScheduler;
  }
}

export default fp(async (fastify) => {
  const scheduler = new TaskScheduler(fastify.config.googleCloudTasks);
  await scheduler.init();
  fastify.decorate("taskScheduler", scheduler);
});
