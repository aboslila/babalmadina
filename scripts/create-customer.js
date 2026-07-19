// Temporary way to create customer accounts until we build the admin form.
// Usage: node scripts/create-customer.js <username> <password> "<full name>" <phone>
// Example: node scripts/create-customer.js ahmed pass123 "Ahmed Ali" 0912345678

const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const path = require("path");

const [username, password, fullName, phone] = process.argv.slice(2);

if (!username || !password || !fullName || !phone) {
  console.log('Usage: node scripts/create-customer.js <username> <password> "<full name>" <phone>');
  process.exit(1);
}

const dbPath = path.join(__dirname, "..", "data", "store.db");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const passwordHash = bcrypt.hashSync(password, 10);

try {
  db.prepare(
    "INSERT INTO customers (username, password_hash, full_name, phone) VALUES (?, ?, ?, ?)"
  ).run(username, passwordHash, fullName, phone);
  console.log(`Customer "${fullName}" created with username "${username}".`);
} catch (err) {
  if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
    console.log(`Username "${username}" already exists.`);
  } else {
    throw err;
  }
}
