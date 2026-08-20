import { db, Product } from "@/lib/db";
import ProductGrid from "./ProductGrid";
import PageHeading from "./PageHeading";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = db
    .prepare("SELECT * FROM products WHERE stock > 0 ORDER BY id")
    .all() as Product[];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <PageHeading />
      <ProductGrid products={products} />
    </main>
  );
}
