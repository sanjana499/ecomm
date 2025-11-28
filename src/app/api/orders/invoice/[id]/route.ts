import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { PDFDocument, rgb } from "pdf-lib";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import fontkit from "@pdf-lib/fontkit";


// Helpers
function formatRs(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function numberToWords(num: number): string {
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (num === 0) return "Zero";
  if (num < 20) return a[num];
  if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
  if (num < 1000) return a[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + numberToWords(num % 100) : "");
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "");
  return String(num);
}

function wrap(text: string, font: any, size: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const w of words) {
    const test = line + w + " ";
    if (font.widthOfTextAtSize(test, size) > maxWidth) {
      lines.push(line.trim());
      line = w + " ";
    } else line = test;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await db.select().from(orders).where(eq(orders.id, Number(id))).limit(1);
    if (!data.length) return NextResponse.json({ error: "Order Not Found" });

    const order = data[0];
    const items = JSON.parse(order.items || "[]");

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Fonts
    const fontBytes = fs.readFileSync(path.join(process.cwd(), "public/fonts/NotoSans-Regular.ttf"));
    const font = await pdfDoc.embedFont(fontBytes, { subset: true });
    const fontBoldBytes = fs.readFileSync(path.join(process.cwd(), "public/fonts/NotoSans-Bold.ttf"));
    const fontBold = await pdfDoc.embedFont(fontBoldBytes, { subset: true });

    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();
    const margin = 40;

    const draw = (text: string, x: number, y: number, size = 11, isBold = false) => {
      page.drawText(text, { x, y, size, font: isBold ? fontBold : font, color: rgb(0, 0, 0) });
    };

    let y = height - margin;

    // --- HEADER ---
    draw("ecomm", margin, y, 20, true);

    // Invoice type
    const invoiceText = "TAX INVOICE / BILL OF SUPPLY / Cash Memo";
    const invoiceLines = wrap(invoiceText, fontBold, 16, 200);
    let invY = y;
    invoiceLines.forEach(line => { draw(line, width - margin - 220, invY, 16, true); invY -= 18; });

    y -= 60;

    // --- SOLD BY + PAN/GST/CIN ---
    const leftX = margin;
    let leftY = y;
    draw("Sold By:", leftX, leftY, 11, true);
    leftY -= 14;

    const soldByLines = wrap(`ecomm, Niwaj Kheda Moti Nagar 2nd road Aishbagh, Lucknow, Uttar Pradesh, 226004`, font, 11, 200);
    soldByLines.forEach(line => { draw(line, leftX, leftY); leftY -= 14; });

    leftY -= 25; // extra spacing before PAN/GST/CIN

    draw("PAN:", leftX, leftY, 11, true);
    draw("ABCDE1234F", leftX + 40, leftY);
    leftY -= 16;

    draw("GST Reg:", leftX, leftY, 11, true);
    draw("07ABCDE1234F1Z5", leftX + 60, leftY);
    leftY -= 16;

    draw("CIN:", leftX, leftY, 11, true);
    draw("U12345KA2025PTC123456", leftX + 35, leftY);
    leftY -= 20;

    // --- RIGHT: Billing/Shipping ---
    const rightX = 350;
    let addressY = y;

    draw("Billing Address:", rightX, addressY, 11, true);
    const billingLines = wrap(`${order.name}, ${order.shipping_address}, ${order.city}, ${order.state}, ${order.pincode}`, font, 11, 200);
    addressY -= 14;
    billingLines.forEach((line, i) => draw(line, rightX, addressY - i * 14));
    addressY -= billingLines.length * 14;

    // Add more gap before Shipping Address
    addressY -= 31; // <-- increased gap

    draw("Shipping Address:", rightX, addressY, 11, true);
    const shippingLines = wrap(`${order.shipping_address}, ${order.city}, ${order.state}, ${order.pincode}`, font, 11, 200);
    addressY -= 14;
    shippingLines.forEach((line, i) => draw(line, rightX, addressY - i * 14));
    addressY -= shippingLines.length * 14;

    // Add more gap before Shipping Address
    addressY -= 25; // <-- increased gap

    // --- QR CODE ---
    const qrHeading = "Scan for Order Details";
    const headingHeight = 12;
    draw(qrHeading, leftX, leftY - headingHeight, 11, true);

    const qrDataUrl = await QRCode.toDataURL(`https://localhost:3000/order/${order.id}`);
    const qrBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
    const qrImg = await pdfDoc.embedPng(qrBytes);
    page.drawImage(qrImg, { x: leftX, y: leftY - headingHeight - 2 - 70, width: 70, height: 70 });

    y = Math.min(leftY - headingHeight - 70 - 5, addressY);

    // --- ORDER & INVOICE DETAILS ---
    draw("Order Number:", leftX, y - 10, 11, true);
    draw(`${order.id}`, leftX + 90, y - 10);

    draw("Order Date:", leftX, y - 25, 11, true);
    draw(`${order.created_at?.toISOString().split("T")[0] ?? ""}`, leftX + 90, y - 25);

    draw("Invoice Number:", width - 200, y - 10, 11, true);
    draw(`INV-${order.id}`, width - 200 + 110, y - 10);

    draw("Invoice Date:", width - 200, y - 25, 11, true);
    draw(`${new Date().toISOString().split("T")[0]}`, width - 200 + 110, y - 25);

    y -= 60;

    // --- TABLE ---
    const tableX = margin;
    const tableWidth = width - 2 * margin;
    const colWidths = [30, 250, 80, 40, 80];
    const headerHeight = 20;

    // Draw light grey background for header row
    page.drawRectangle({
      x: tableX,
      y: y - headerHeight,
      width: tableWidth,
      height: headerHeight,
      color: rgb(0.8, 0.8, 0.8), // light grey
    });

    page.drawLine({ start: { x: tableX, y }, end: { x: tableX + tableWidth, y }, thickness: 1 });
    let x = tableX;
    ["SL", "Description", "Unit Price", "Qty", "Net Amt"].forEach((title, i) => {
      draw(title, x + 2, y - 12, 11, true);
      x += colWidths[i];
    });
    page.drawLine({ start: { x: tableX, y: y - 20 }, end: { x: tableX + tableWidth, y: y - 20 }, thickness: 1 });

    let sl = 1;
    let subtotal = 0;
    y -= headerHeight;
    for (const item of items) {
      const qty = Number(item.quantity);
      const price = Number(item.offerPrice);
      const total = qty * price;
      subtotal += total;

      x = tableX;
      const rowHeight = 20;
      draw(String(sl++), x + 2, y - 12); x += colWidths[0];
      draw(item.title ?? "", x + 2, y - 12); x += colWidths[1];
      draw(formatRs(price), x + 2, y - 12); x += colWidths[2];
      draw(String(qty), x + 2, y - 12); x += colWidths[3];
      draw(formatRs(total), x + 2, y - 12); x += colWidths[4];
      page.drawLine({ start: { x: tableX, y }, end: { x: tableX + tableWidth, y }, thickness: 1 });
      y -= rowHeight;
    }

    // Vertical lines
    let xLine = tableX;
    page.drawLine({ start: { x: xLine, y: y + (items.length + 1) * 20 }, end: { x: xLine, y }, thickness: 1 });
    xLine += colWidths[0];
    for (let i = 1; i < colWidths.length; i++) {
      page.drawLine({ start: { x: xLine, y: y + (items.length + 1) * 20 }, end: { x: xLine, y }, thickness: 1 });
      xLine += colWidths[i];
    }
    page.drawLine({ start: { x: tableX + tableWidth, y: y + (items.length + 1) * 20 }, end: { x: tableX + tableWidth, y }, thickness: 1 });

    // --- TOTAL ---
    const totalBoxHeight = 25;
    const totalBoxY = y - totalBoxHeight;
    page.drawRectangle({ x: tableX, y: totalBoxY, width: tableWidth, height: totalBoxHeight, borderWidth: 1, color: rgb(1, 1, 1) });
    draw("TOTAL:", tableX + 2, totalBoxY + 7, 8, true);
    draw(formatRs(subtotal), tableX + tableWidth - 80, totalBoxY + 7, 11, true);
    y = totalBoxY;

    // --- AMOUNT IN WORDS (Right-aligned, bold) ---
    const amountBoxHeight = 30;
    const amountBoxY = y - amountBoxHeight;
    page.drawRectangle({ x: tableX, y: amountBoxY, width: tableWidth, height: amountBoxHeight, borderWidth: 1, color: rgb(1, 1, 1) });
    draw("Amount in Words:", tableX + 2, amountBoxY + 10, 11, true);
    const amountText = numberToWords(Math.round(subtotal)) + " Rupees Only";
    const amountTextWidth = fontBold.widthOfTextAtSize(amountText, 11);
    draw(amountText, tableX + tableWidth - amountTextWidth - 5, amountBoxY + 10, 11, true);
    y = amountBoxY;

    // --- SIGNATURE BOX ---
    const signBoxHeight = 120;
    const signBoxY = y - signBoxHeight;
    page.drawRectangle({ x: tableX, y: signBoxY, width: tableWidth, height: signBoxHeight, borderWidth: 1, color: rgb(1, 1, 1) });
    const sig1 = "For ecomm Seller Services Private Limited:";
    const sig2 = "Authorized Signatory";
    draw(sig1, tableX + tableWidth - fontBold.widthOfTextAtSize(sig1, 11) - 5, signBoxY + signBoxHeight - 20, 11, true);
    draw(sig2, tableX + tableWidth - fontBold.widthOfTextAtSize(sig2, 11) - 5, signBoxY + 15, 11, true);

    const pdfBytes = await pdfDoc.save();
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=invoice_${order.id}.pdf`
      }
    });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server Error" });
  }
}
