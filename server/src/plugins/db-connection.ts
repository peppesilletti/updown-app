import fp from "fastify-plugin";
import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import { DB } from "../db/db";

const { Pool } = pg;

declare module "fastify" {
  interface FastifyInstance {
    db: Kysely<DB>;
  }
}

export default fp(async (fastify) => {
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: fastify.config.db.host,
        port: fastify.config.db.port,
        user: fastify.config.db.user,
        password: fastify.config.db.password,
        database: fastify.config.db.database,
      }),
    }),
  });

  fastify.decorate("db", db);
  fastify.addHook("onClose", () => db.destroy());
  fastify.log.info("Connected to database");
});
