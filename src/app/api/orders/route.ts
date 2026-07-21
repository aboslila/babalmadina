import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { items } = await request.json();
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const total = items.reduce(
    (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity,
    0
  );

  const insertOrder = db.prepare(
    "INSERT INTO orders (customer_id, total) VALUES (?, ?)"
  );
  const insertItem = db.prepare(
    `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity)
     VALUES (?, ?, ?, ?, ?)`
  );

  const createOrder = db.transaction(() => {
    const result = insertOrder.run(customer.id, total);
    const orderId = result.lastInsertRowid;

    for (const item of items) {
      insertItem.run(orderId, item.productId, item.name, item.price, item.quantity);
    }
    return orderId;
  });

  const orderId = createOrder();
  return NextResponse.json({ ok: true, orderId });
}