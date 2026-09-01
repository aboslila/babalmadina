import { db, Product } from "@/lib/db";
import ProductsPageClient from "./ProductsPageClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = db
    .prepare("SELECT * FROM products WHERE stock > 0 ORDER BY id")
    .all() as Product[];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 pb-24">
      <h1 className="text-2xl font-extrabold mb-6">تصفح المنتجات</h1>
      <ProductsPageClient products={products} />
    </main>
  );
}
