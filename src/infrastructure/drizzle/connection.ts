import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "../../modules/users/drizzle/schema/index";

export class DrizzleConnection {
  private static instance: DrizzleConnection;

  public static getInstance(): DrizzleConnection {
    if (!DrizzleConnection.instance) {
      DrizzleConnection.instance = new DrizzleConnection();
    }

    return DrizzleConnection.instance;
  }

  private conn: postgres.Sql = postgres({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  public db = drizzle(this.conn, { schema });
}
