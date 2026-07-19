// Reads data/products.xlsx and replaces the products table content with it.
// Run with: node scripts/import-excel.js
// This is the "sync" step: client updates the Excel file -> you run this
// (or later, an admin page calls this same logic) -> DB matches Excel.

const XLSX = require("xlsx");
const Database = require("better-sqlite3");
const path = require("path");

const excelPath = path.join(__dirname, "..", "data", "products.xlsx");
const dbPath = path.join(__dirname, "..", "data", "store.db");

const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    description TEXT
  )
`);

// Simplest correct strategy at this scale: wipe and reinsert.
// (For a bigger catalog we'd diff by name/SKU instead of a full wipe.)
const insert = db.prepare(`
  INSERT INTO products (name, category, price, stock, image_url, description)
  VALUES (@name, @category, @price, @stock, @image_url, @description)
`);

const importAll = db.transaction((rows) => {
  db.exec("DELETE FROM products");
  for (const row of rows) {
    insert.run({
      name: row.name ?? "",
      category: row.category ?? null,
      price: Number(row.price) || 0,
      stock: Number(row.stock) || 0,
      image_url: row.image_url ?? null,
      description: row.description ?? null,
    });
  }
});

importAll(rows);
console.log(`Imported ${rows.length} products from Excel into the database.`);
