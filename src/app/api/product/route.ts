import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories, products, sub_categories } from "@/lib/schema";
import { writeFile, mkdir, chmod } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { eq ,desc} from "drizzle-orm";

const uploadsDir = "/uploads"; 
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSizeInBytes = 10 * 1024 * 1024; // 10MB

// 🟢 CREATE PRODUCT
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // 🖼️ Handle image
    const file = formData.get("img") as File | null;
    let imagePath = "";

    if (file) {
      if (!allowedImageTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, message: "Invalid image type" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      if (buffer.length > maxSizeInBytes) {
        return NextResponse.json(
          { success: false, message: "Image size exceeds 10MB" },
          { status: 400 }
        );
      }

      await mkdir(uploadsDir, { recursive: true });
      const extension = path.extname(file.name) || ".jpg";
      const filename = `${uuidv4()}${extension}`;
      const filepath = path.join(uploadsDir, filename);

      await writeFile(filepath, buffer);
      await chmod(filepath, 0o777);

      imagePath = `/uploads/${filename}`;
    }

    // 🧾 Extract form fields
    const title = formData.get("title") as string;
    const category_id = Number(formData.get("category_id"));
    const sub_category_id = formData.get("sub_category_id")
      ? Number(formData.get("sub_category_id"))
      : null;
    const price = formData.get("price") as string; // ✅ stored as string
    const offerPrice = formData.get("offerPrice")
      ? (formData.get("offerPrice") as string)
      : null; // ✅ must be string or null
    const description = formData.get("description") as string | null;
    const color = formData.get("color") as string | null;
    const size = formData.get("size") as string | null; 
    const quantity = formData.get("quantity")
      ? Number(formData.get("quantity"))
      : 0;
    const gender = formData.get("gender") as string | null;
    const type = formData.get("type") as string | null;
    const desc = formData.get("desc") as string | null;
    const status =
      (formData.get("status") as "active" | "inactive") ?? "inactive"; // ✅ enum type


    // ✅ Build product data explicitly typed
    const newProduct: typeof products.$inferInsert = {
      title,
      img: imagePath,
      category_id,
      sub_category_id,
      price,
      offerPrice,
      description,
      color,
      size,
      quantity,
      gender,
      type,
      desc,
      status,
    };

    // ✅ Insert into database
    const [result] = await db.insert(products).values(newProduct);

    return NextResponse.json({
      success: true,
      message: "✅ Product added successfully!",
      insertedId: (result as any).insertId ?? null,
    });
  } catch (error) {
    console.error("❌ Product POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save product" },
      { status: 500 }
    );
  }
}


// 📦 GET — Fetch all products
// ===============================
export async function GET() {
  try {
    const allProducts = await db
      .select({
        id: products.id,
        title: products.title,
        img: products.img,
        price: products.price,
        offerPrice: products.offerPrice,
        quantity: products.quantity,
        description: products.description,
        desc: products.desc,
        color: products.color,
        size: products.size,
        type: products.type,
        gender: products.gender,
        status: products.status,
        category_id: products.category_id,
        sub_category_id: products.sub_category_id,
        category_name: categories.name,
        sub_category_name: sub_categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.category_id, categories.id))
      .leftJoin(sub_categories, eq(products.sub_category_id, sub_categories.id))
      .orderBy(desc(products.id)); // ✅ latest products appear first

      

    // 🧠 Generate unique filter data
    const filters = {
      colors: [...new Set(allProducts.map((p) => p.color).filter(Boolean))],
      sizes: [...new Set(allProducts.map((p) => p.size).filter(Boolean))],
      discounts: [
        ...new Set(
          allProducts
            .filter((p) => p.offerPrice && p.price)
            .map(
              (p) =>
                Math.round(
                  ((Number(p.price) - Number(p.offerPrice)) / Number(p.price)) * 100
                )
            )
        ),
      ],
      types: [...new Set(allProducts.map((p) => p.type).filter(Boolean))],
      genders: [...new Set(allProducts.map((p) => p.gender).filter(Boolean))],
      categories: [...new Set(allProducts.map((p) => p.category_name).filter(Boolean))],
      subCategories: [
        ...new Set(allProducts.map((p) => p.sub_category_name).filter(Boolean)),
      ],
    };

    return NextResponse.json({ products: allProducts, filters });
  } catch (error) {
    console.error("❌ Error loading products:", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}


// 🔴 DELETE PRODUCT
// export async function DELETE(req: NextRequest) {
//   try {
//     const { id } = await req.json();

//     await db.delete(products).where(eq(products.id, id));

//     return NextResponse.json({
//       success: true,
//       message: "Product deleted successfully",
//     });
//   } catch (error) {
//     console.error("❌ Product DELETE error:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to delete product" },
//       { status: 500 }
//     );
//   }
// }
