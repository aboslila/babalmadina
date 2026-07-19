import { NextRequest, NextResponse } from "next/server";
import { verifyCustomer, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
  }

  const customer = verifyCustomer(username, password);
  if (!customer) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  await createSession(customer.id);
  return NextResponse.json({ ok: true });
}
