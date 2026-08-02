import { NextRequest, NextResponse } from "next/server";
import { loginAdmin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "كلمة مرور خاطئة" }, { status: 401 });
  }

  await loginAdmin();
  return NextResponse.json({ ok: true });
}
