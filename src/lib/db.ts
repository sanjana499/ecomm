
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/lib/schema"; // ✅ import schema

// 🧩 Create MySQL connection
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "shop_ease",
});

// ✅ Pass both `schema` and `mode` to drizzle
export const db = drizzle(connection, {
  schema,
  mode: "default", // ✅ required for standard MySQL (not PlanetScale)
});
