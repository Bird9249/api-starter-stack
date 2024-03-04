import type { Config } from "drizzle-kit";

export default {
  schema: "./src/modules/**/drizzle/schema/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: <string>process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: <string>process.env.DB_NAME,
  },
} satisfies Config;
