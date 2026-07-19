import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { db, Customer } from "./db";

const SESSION_COOKIE = "session_token";

// Runs on login: checks username + password against the stored hash.
// We never store plain passwords — only the bcrypt hash. bcrypt.compare
// re-hashes the input with the same salt and compares, it's one-way.
export function verifyCustomer(username: string, password: string): Customer | null {
  const customer = db
    .prepare("SELECT * FROM customers WHERE username = ?")
    .get(username) as Customer | undefined;

  if (!customer) return null;

  const valid = bcrypt.compareSync(password, customer.password_hash);
  return valid ? customer : null;
}

// Creates a session row + sets an httpOnly cookie holding just the token.
// httpOnly means client-side JS can't read this cookie (protects against
// XSS stealing the session) — this is the equivalent of what Nuxt's
// auth modules do under the hood with their session cookies.
export async function createSession(customerId: number) {
  const token = randomBytes(32).toString("hex");

  db.prepare("INSERT INTO sessions (token, customer_id) VALUES (?, ?)").run(
    token,
    customerId
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

// Reads the cookie, looks up the session, returns the logged-in customer
// (or null). Call this at the top of any page/route that needs to know
// "who is browsing right now".
export async function getCurrentCustomer(): Promise<Customer | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = db
    .prepare(
      `SELECT customers.* FROM sessions
       JOIN customers ON customers.id = sessions.customer_id
       WHERE sessions.token = ?`
    )
    .get(token) as Customer | undefined;

  return row ?? null;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  }
  cookieStore.delete(SESSION_COOKIE);
}
