import * as XLSX from "xlsx";
import { db } from "./db";

export function importProductsFromBuffer(buffer: Buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as Record<
    string,
    unknown
  >[];

  const insert = db.prepare(`
    INSERT OR REPLACE INTO products (art_no, category, pack, ref_code, unit_price, carton_price, stock)
    VALUES (@art_no, @category, @pack, @ref_code, @unit_price, @carton_price, @stock)
  `);

  const importAll = db.transaction((rows: Record<string, unknown>[]) => {
    db.exec("DELETE FROM products");
    for (const row of rows) {
      insert.run({
        art_no: String(row["ArtNo"] ?? ""),
        category: row["Categ"] ? String(row["Categ"]) : null,
        pack: Number(row["pack"]) || 0,
        ref_code: row["الرمز"] ? String(row["الرمز"]) : null,
        unit_price: Number(row["سعر القطعة"]) || 0,
        carton_price: Number(row["سعر الكرتون"]) || 0,
        stock: 100,
      });
    }
  });

  importAll(rows);
  return rows.length;
}
