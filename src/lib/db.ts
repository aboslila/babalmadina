import Database from "better-sqlite3";
import path from "path";

// Single shared connection. In dev, Next.js hot-reloads modules,
// so we stash the instance on `global` to avoid opening the file
// multiple times (same trick as the classic "prisma singleton" pattern).
declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

const dbPath = path.join(process.cwd(), "data", "store.db");

export const db = global.__db ?? new Database(dbPath);
if (process.env.NODE_ENV !== "production") global.__db = db;

// Runs once — creates the table if it doesn't exist yet.
// This is our "migration" for now; fine at this scale.
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

export type Product = {
  id: number;
  name: string;
  category: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  description: string | null;
};
