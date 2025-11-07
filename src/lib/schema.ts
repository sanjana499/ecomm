// lib/db/schema.ts
import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  mysqlEnum as drizzleEnum,
  boolean,
} from "drizzle-orm/mysql-core";


// ✅ Users Table
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category_id: int("category_id").notNull(),
  sub_category_id: int("sub_category_id"),
  price: varchar("price", { length: 100 }).notNull(),
  status: drizzleEnum("status", ["active", "inactive"]).default("inactive").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow().defaultNow(),
  deleted_at: timestamp("deleted_at"),
});
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: boolean("status").notNull().default(true).$type<boolean>(), 
  image: varchar("image", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),      // ✅ fixed
  updatedAt: timestamp("updated_at").onUpdateNow().defaultNow(), // ✅ fixed
  deletedAt: timestamp("deleted_at"),                   // ✅ fixed
});

export const sub_categories = mysqlTable("sub_categories",{
   id: int("id").autoincrement().primaryKey(),
   name: varchar("name", { length: 255 }).notNull(),
  categories_id: int("categories_id").notNull(),  
  description: varchar("description", { length: 500 }).default(""), // Product description
  status: varchar("status", { length: 50 }).default("active"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow().defaultNow(),
  deleted_at: timestamp("deleted_at"),
})

function mysqlEnum(arg0: string, arg1: string[]) {
  throw new Error("Function not implemented.");
}
