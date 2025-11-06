// lib/db/schema.ts
import { mysqlTable, varchar, int, timestamp, decimal, text, boolean } from "drizzle-orm/mysql-core";

// ✅ Users Table
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ✅ Products Table
// ✅ Products Table
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),       // Auto-increment ID
  name: varchar("name", { length: 255 }).notNull(),  // Product name
  category_id: int("category_id").notNull(),        // Foreign key to category
  sub_category_id: int("sub_category_id"), // Optional foreign key to subcategory
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Product price
  status: boolean("status").default(true),          // Active/inactive
  description: varchar("description", { length: 500 }).default(""), // Product description
  created_at: timestamp("created_at").defaultNow(), // Auto-set created time
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(), // Auto-update on edit
  deleted_at: timestamp("deleted_at"), // Soft delete
});

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
 status: varchar("status", { length: 50 }).default("active"),
  image: varchar("image", { length: 500 }), // ✅ Image URL or path
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const sub_categories = mysqlTable("sub_categories",{
   id: int("id").autoincrement().primaryKey(),
   name: varchar("name", { length: 255 }).notNull(),
  category_id: int("category_id").notNull(),  
  description: varchar("description", { length: 500 }).default(""), // Product description
  status: varchar("status", { length: 50 }).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow().defaultNow(),
  deletedAt: timestamp("deleted_at"),
})