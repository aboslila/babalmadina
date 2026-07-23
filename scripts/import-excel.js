const XLSX = require("xlsx");
const Database = require("better-sqlite3");
const path = require("path");

const excelPath = path.join(__dirname, "..", "data", "products.xlsx");
const dbPath = path.join(__dirname, "..", "data", "store.db");

const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
const seen = new Map();
for (const row of rows) {
  const art = row["ArtNo"];
  seen.set(art, (seen.get(art) || 0) + 1);
}
const duplicates = [...seen.entries()].filter(([, count]) => count > 1);
console.log("Duplicate ArtNo values:", duplicates);

const db = new Database(dbPath);
db.pragma("foreign_keys = OFF");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    art_no TEXT NOT NULL UNIQUE,
    category TEXT,
    pack INTEGER NOT NULL,
    ref_code TEXT,
    unit_price REAL NOT NULL,
    carton_price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0
  )
`);

const insert = db.prepare(`
  INSERT OR REPLACE INTO products (art_no, category, pack, ref_code, unit_price, carton_price, stock)
  VALUES (@art_no, @category, @pack, @ref_code, @unit_price, @carton_price, @stock)
`);

const importAll = db.transaction((rows) => {
  db.exec("DELETE FROM products");
  for (const row of rows) {
    insert.run({
      art_no: row["ArtNo"] ?? "",
      category: row["Categ"] ?? null,
      pack: Number(row["pack"]) || 0,
      ref_code: row["الرمز"] ?? null,
      unit_price: Number(row["سعر القطعة"]) || 0,
      carton_price: Number(row["سعر الكرتون"]) || 0,
      stock: 100, // placeholder — client's sheet has no stock column yet
    });
  }
});

importAll(rows);
console.log(`Imported ${rows.length} products from Excel into the database.`);