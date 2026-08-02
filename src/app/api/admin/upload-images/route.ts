import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { isAdminLoggedIn } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  let saved = 0;
  for (const file of files) {
    if (!file.name.toLowerCase().endsWith(".jpg")) continue;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(process.cwd(), "public", "products", file.name);
    await writeFile(filePath, buffer);
    saved++;
  }

  return NextResponse.json({ ok: true, saved });
}
