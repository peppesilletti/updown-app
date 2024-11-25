import dotenvFlow from "dotenv-flow";
import { dirname } from "path";
import pg from "pg";
import Postgrator from "postgrator";
import { fileURLToPath } from "url";
dotenvFlow.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

async function setup() {
  // Create a client of your choice
  const client = new pg.Client({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || "5434"),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });

  try {
    // Establish a database connection
    await client.connect();

    // Create postgrator instance
    const postgrator = new Postgrator({
      migrationPattern: __dirname + "/../migrations/*",
      driver: "pg",
      database: process.env.POSTGRES_DB,
      schemaTable: "schemaversion",
      execQuery: (query) => client.query(query),
      execSqlScript: (sqlScript) => client.query(sqlScript),
    });

    await postgrator.migrate();

    console.log("Migrations applied");
  } catch (error) {

    // If error happened partially through migrations,
    // error object is decorated with appliedMigrations
    console.error(error.appliedMigrations); // array of migration objects
  }

  // Once done migrating, close your connection.
  await client.end();
}

setup()

