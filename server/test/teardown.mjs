import dotenvFlow from "dotenv-flow";
import pg from "pg";
dotenvFlow.config();


async function teardown() {
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

    // Query to drop all tables
    const dropTablesQuery = `
      DO $$ DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
              EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
          END LOOP;
      END $$;
    `;
    await client.query(dropTablesQuery);

    console.log("All tables deleted");
  } catch (error) {

    // If error happened partially through migrations,
    // error object is decorated with appliedMigrations
    console.error(error.appliedMigrations); // array of migration objects
  }

  // Once done migrating, close your connection.
  await client.end();
}

teardown()

