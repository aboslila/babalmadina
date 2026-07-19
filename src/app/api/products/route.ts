import { NextResponse } from "next/server";
import { db, Product } from "@/lib/db";

// GET /api/products
// This is our "backend" — the React equivalent of a Nuxt server route
// (server/api/products.ts). Runs on the server, never shipped to the browser.
export async function GET() {
  const products = db
    .prepare("SELECT * FROM products ORDER BY id")
    .all() as Product[];

  return NextResponse.json(products);
}
