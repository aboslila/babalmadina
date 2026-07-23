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
  art_no TEXT NOT NULL UNIQUE,
  category TEXT,
  pack INTEGER NOT NULL,        -- pieces per carton
  ref_code TEXT,                 -- internal only, never shown to customers
  unit_price REAL NOT NULL,      -- shown for reference
  carton_price REAL NOT NULL,    -- actual purchasable price
  stock INTEGER NOT NULL DEFAULT 0
);

  -- Wholesale customers. No self-signup: the shop admin creates these.
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- One row per logged-in session. Simpler than JWTs for this scale,
  -- and lets us kill a session instantly (logout / revoke) by deleting a row.
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    status TEXT NOT NULL DEFAULT 'pending_call', -- pending_call | contacted | picked_up
    payment_status TEXT NOT NULL DEFAULT 'unpaid', -- unpaid | paid
    total REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    art_no TEXT NOT NULL,        -- snapshot: identifies the product on the bill
    carton_price REAL NOT NULL,  -- snapshot: price per carton at order time
    quantity INTEGER NOT NULL    -- number of cartons ordered
  );
`);

export type Product = {
  id: number;
  art_no: string;
  category: string | null;
  pack: number;
  ref_code: string | null;
  unit_price: number;
  carton_price: number;
  stock: number;
};

export type Customer = {
  id: number;
  username: string;
  password_hash: string;
  full_name: string;
  phone: string;
  created_at: string;
};

export type Order = {
  id: number;
  customer_id: number;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  art_no: string;
  carton_price: number;
  quantity: number;
};
