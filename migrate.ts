import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const conn: postgres.Sql = postgres(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
  { max: 1 }
);

const db = drizzle(conn);
await migrate(db, { migrationsFolder: "drizzle" });

await conn.end();
