import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    // ✅ Unwrap params (since it's a Promise in App Router)
    const { filename } = await context.params;

    // ✅ Correct uploads directory (inside /public)
    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    console.log("🖼️ Serving file:", filePath);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    // ✅ Detect file type for correct Content-Type header
    const mimeType =
      ext === ".png"
        ? "image/png"
        : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".webp"
        ? "image/webp"
        : "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("❌ Error loading image:", err);
    return NextResponse.json(
      { error: "Failed to load image" },
      { status: 500 }
    );
  }
}
