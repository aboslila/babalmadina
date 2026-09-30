import { NextRequest, NextResponse } from "next/server";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import { db } from "@/lib/db";

type StockUpdate = { id: number; stock: number };

// POST /api/admin/stock
// Body: { items: [{ id, stock }] } — the available piece count per product.
export async function POST(request: NextRequest) {
  if (!(await isAdminLoggedIn())) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const rawItems = (body as { items?: unknown })?.items;
  if (!Array.isArray(rawItems)) {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const updates: StockUpdate[] = [];
  for (const entry of rawItems) {
    const id = Number((entry as StockUpdate)?.id);
    const stock = Number((entry as StockUpdate)?.stock);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "معرّف منتج غير صالح" }, { status: 400 });
    }
    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json(
        { error: "الكمية يجب أن تكون رقماً صحيحاً غير سالب" },
        { status: 400 },
      );
    }

    updates.push({ id, stock });
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: "لا توجد تغييرات" }, { status: 400 });
  }

  const update = db.prepare("UPDATE products SET stock = ? WHERE id = ?");
  const applyAll = db.transaction((rows: StockUpdate[]) => {
    let changed = 0;
    for (const row of rows) {
      changed += update.run(row.stock, row.id).changes;
    }
    return changed;
  });

  const changed = applyAll(updates);

  return NextResponse.json({ ok: true, updated: changed });
}
