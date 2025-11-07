import { drizzle } from "drizzle-orm/libsql";
import "dotenv/config";
import * as schema from "./schema";

export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL as string,
    authToken: process.env.TURSO_AUTH_TOKEN as string,
  },
  schema,
  casing: "snake_case",
});
