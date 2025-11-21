import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(_req: any, { params }: any) {
  try {
    const uploadsDir = "D:/ecomm/uploads";

    const filename = params.filename;
    if (!filename) {
      return new NextResponse("Filename missing", { status: 400 });
    }

    const filePath = path.join(uploadsDir, filename);

    console.log("📸 Loading image:", filePath);

    const fileData = await fs.readFile(filePath);

    const ext = path.extname(filename).toLowerCase();

    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
    };
    
    return new NextResponse(fileData, {
      headers: {
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
      },
    });
    
  } catch (error) {
    console.error("❌ Image load error:", error);
    return new NextResponse("Not Found", { status: 404 });
  }
}
