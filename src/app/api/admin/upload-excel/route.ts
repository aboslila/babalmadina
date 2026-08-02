import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import { importProductsFromBuffer } from "@/lib/import-products";

export async function POST(request: NextRequest) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "لم يتم اختيار ملف" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Still save a copy to disk, so `data/products.xlsx` stays the record of
  // "what's currently live" — useful for your CLI script and backups.
  const filePath = path.join(process.cwd(), "data", "products.xlsx");
  await writeFile(filePath, buffer);

  const count = importProductsFromBuffer(buffer);

  return NextResponse.json({ ok: true, count });
}
