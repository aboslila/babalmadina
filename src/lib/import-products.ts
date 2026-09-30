import * as XLSX from "xlsx";
import { db } from "./db";

export function importProductsFromBuffer(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as Record<
    string,
    unknown
  >[];

  // The Excel file is the source of truth for prices, but NOT for stock.
  // Stock is maintained by the shop admin from the dashboard, so we snapshot
  // it before the import and put it back, otherwise every re-import would
  // wipe the quantities the admin typed in.
  const previousStock = new Map<string, number>();
  const previousRows = db
    .prepare("SELECT art_no, stock FROM products")
    .all() as { art_no: string; stock: number }[];
  for (const row of previousRows) {
    previousStock.set(row.art_no, row.stock);
  }

  const insert = db.prepare(`
    INSERT OR REPLACE INTO products (art_no, category, pack, ref_code, unit_price, carton_price, stock)
    VALUES (@art_no, @category, @pack, @ref_code, @unit_price, @carton_price, @stock)
  `);

  let count = 0;

  const importAll = db.transaction((rows: Record<string, unknown>[]) => {
    db.exec("DELETE FROM products");
    for (const row of rows) {
      const artNo = String(row["ArtNo"] ?? "");
      insert.run({
        art_no: artNo,
        category: row["Categ"] ? String(row["Categ"]) : null,
        pack: Number(row["pack"]) || 0,
        ref_code: row["الرمز"] ? String(row["الرمز"]) : null,
        unit_price: Number(row["سعر القطعة"]) || 0,
        carton_price: Number(row["سعر الكرتون"]) || 0,
        // Keep what the admin already set; new products start empty until
        // a quantity is entered from the dashboard.
        stock: previousStock.get(artNo) ?? 0,
      });
      count++;
    }
  });

  importAll(rows);
  return count;
}
