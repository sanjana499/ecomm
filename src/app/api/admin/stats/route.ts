// src/app/api/admin/stats/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, orders, products, categories, order_items, cart } from "@/lib/schema";
import { gt, eq, inArray, lt } from "drizzle-orm";

// ---------------- TYPES ----------------
type _OrderItemType = {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
  };
  
  type _ProductType = {
    id: number;
    title: string;
    category_id: number;
    sub_category_id: number;
    price: number;
  };
  

// ---------------- MAIN HANDLER ----------------
export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const start30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const start7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // ----- basic counts -----
    const allUsers = await db.select().from(users);
    const allOrders = await db.select().from(orders);
    const allProducts = await db.select().from(products);
    const allCategories = await db.select().from(categories);

    const totalUsers = allUsers.length;
    const totalOrders = allOrders.length;
    const totalProducts = allProducts.length;
    const totalCategories = allCategories.length;

    // ----- Monthly Orders -----
    const ordersThisMonth = await db
      .select()
      .from(orders)
      .where(gt(orders.created_at, startOfMonth));

    const monthlyOrders = ordersThisMonth.length;
    const monthlyRevenue = ordersThisMonth.reduce(
      (s, o: any) => s + Number(o.total_amount || 0),
      0
    );

    // ---------- CATEGORY WISE SALES ----------
let categorySales: { category: string; sold: number }[] = [];

try {
  const rows = await db
    .select({
      categoryId: products.category_id,
      categoryName: categories.name,
      qty: order_items.quantity,    })
    .from(order_items)
    .innerJoin(products, eq(products.id, cart.productId))
    .innerJoin(categories, eq(categories.id, products.category_id));

  const catMap = new Map<string, number>();

  rows.forEach((r) => {
    const name = r.categoryName || "Uncategorized";
    const sold = Number(r.qty || 0);

    catMap.set(name, (catMap.get(name) || 0) + sold);
  });

  categorySales = Array.from(catMap.entries()).map(([category, sold]) => ({
    category,
    sold,
  }));
} catch (err) {
  console.log("Category Sales Error", err);
  categorySales = [];
}


    // ----- Last 30 days -----
    const recentOrders = await db
      .select()
      .from(orders)
      .where(gt(orders.created_at, start30Days));

    const revenueLast30 = recentOrders.reduce(
      (s, o: any) => s + Number(o.total_amount || 0),
      0
    );

    // ----- Daily Orders for last 7 days -----
    const last7Orders = await db
      .select()
      .from(orders)
      .where(gt(orders.created_at, start7Days));

    const dayMap: Record<string, number> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dayMap[key] = 0;
    }

    last7Orders.forEach((o: any) => {
      const key = new Date(o.created_at).toISOString().slice(0, 10);
      if (key in dayMap) dayMap[key] += 1;
    });

    const dailyOrders = Object.entries(dayMap).map(([date, count]) => ({
      date,
      count,
    }));

    // ---------------- TOP PRODUCTS ----------------
    const orderItemsWithProducts = await db
      .select({
        product_id: order_items.product_id,
        quantity: order_items.quantity,
        title: products.title,
      })
      .from(order_items)
      .innerJoin(products, eq(products.id, order_items.product_id));

    const productMap = new Map<
      number,
      { product_id: number; title: string; sold: number }
    >();

    orderItemsWithProducts.forEach((row) => {
      const pid = row.product_id;
      const qty = Number(row.quantity || 0);

      if (!productMap.has(pid)) {
        productMap.set(pid, { product_id: pid, title: row.title, sold: qty });
      } else {
        productMap.get(pid)!.sold += qty;
      }
    });

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 6);

    // ---------------- CATEGORY SALES ----------------
    const allOrderItems = await db
      .select({
        product_id: order_items.product_id,
        quantity: order_items.quantity,
      })
      .from(order_items);

    const productIds = [...new Set(allOrderItems.map((i) => i.product_id))];

    const productData = await db
      .select({
        id: products.id,
        title: products.title,
        category_id: products.category_id,
      })
      .from(products)
      .where(inArray(products.id, productIds));

    const categoryMap = new Map<string, number>();

    allOrderItems.forEach((item) => {
      const product = productData.find((p) => p.id === item.product_id);
      if (!product) return;

      const categoryRow = allCategories.find((c) => c.id === product.category_id);
      const categoryName = categoryRow?.name || "Uncategorized";

      categoryMap.set(
        categoryName,
        (categoryMap.get(categoryName) || 0) + Number(item.quantity || 0)
      );
    });

    // const categorySales = Array.from(categoryMap.entries()).map(
    //   ([category, sold]) => ({
    //     category,
    //     sold,
    //   })
    // );

    // ---------------- Order Status ----------------
    const statusCounts: Record<string, number> = {};
    allOrders.forEach((o: any) => {
      const s = o.order_status || "unknown";
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    });

    // ---------------- Low Stock ----------------
    const lowStockProducts = await db
      .select()
      .from(products)
      .where(lt(products.quantity, 5));

    // ---------------- FINAL RESPONSE ----------------
    return NextResponse.json({
      users: totalUsers,
      orders: totalOrders,
      products: totalProducts,
      categories: totalCategories,

      monthlyOrders,
      monthlyRevenue,
      dailyOrders,
      revenueLast30,

      topProducts,
      categorySales,

      orderStatus: statusCounts,
      pending: statusCounts.pending ?? 0,
      success: statusCounts.success ?? 0,

      newUsersThisMonth: allUsers.filter(
        (u: any) => new Date(u.created_at) >= startOfMonth
      ).length,

      lowStockProducts,
      recentOrdersCount: recentOrders.length,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json(
      { error: "Failed to compute stats" },
      { status: 500 }
    );
  }
}
