// lib/db/schema.ts
// lib/db/schema.ts
import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  mysqlEnum as drizzleEnum, 
  decimal,
  boolean,
  serial,
} from "drizzle-orm/mysql-core";

// ✅ Users Table
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }).notNull(),
  state: varchar("state", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  customerId: varchar("customer_id", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// ✅ Products Table
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  img: varchar("img", { length: 255 }).notNull(),
  category_id: int("category_id").notNull(),
  sub_category_id: int("sub_category_id"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: drizzleEnum("status", ["active", "inactive"])
    .default("inactive")
    .notNull(),
  description: text("description"),
  color: varchar("color", { length: 100 }),
  size: varchar("size", { length: 50 }),
  quantity: int("quantity").default(0),
  offerPrice: decimal("offer_price", { precision: 10, scale: 2 }),
  desc: text("desc"),
  gender: varchar("gender", { length: 20 }),
  type: varchar("type", { length: 50 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").onUpdateNow().defaultNow(),
  deleted_at: timestamp("deleted_at"),
});

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(), // ✅ add this
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

export const cart = mysqlTable("cart", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull(), // if you have user login
  productId: int("product_id").notNull(),
  quantity: int("quantity").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const addresses = mysqlTable("addresses", {
  id: serial("id").primaryKey(),
  userId: int("user_id"),
  name: varchar("name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  pincode: varchar("pincode", { length: 10 }),
});

export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  user_id: int("user_id").notNull(),
  total_amount: decimal("total_amount", { precision: 10, scale: 0 }).notNull(),
  payment_method: varchar("payment_method", { length: 50 }).notNull().default("online"),
  status: varchar("status", { length: 20 }).default("pending"),
  address_id: int("address_id").notNull(),
  items: text("items").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});


export const order_items = mysqlTable("order_items", {
  id: serial("id").primaryKey(),
  order_id: int("order_id").notNull(),
  product_id: int("product_id").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  quantity: int("quantity").notNull(),
});

