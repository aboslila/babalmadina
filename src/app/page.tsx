import { db, Product } from "@/lib/db";

// No "use client" here — this is a Server Component (the Next.js default).
// It runs ONLY on the server, so it can query the database directly,
// no API call needed. Think of it like Nuxt's server-rendered pages
// with asyncData, except no client-side JS ships for this part at all
// unless you add interactivity.
export default function HomePage() {
  const products = db
    .prepare("SELECT * FROM products ORDER BY id")
    .all() as Product[];

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 flex flex-col gap-2 hover:shadow-md transition-shadow"
          >
            <div className="bg-gray-100 h-40 rounded flex items-center justify-center text-gray-400 text-sm">
              {product.image_url ?? "No image"}
            </div>
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="text-sm">{product.description}</p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold">${product.price.toFixed(2)}</span>
              {product.stock > 0 ? (
                <span className="text-xs text-green-600">In stock</span>
              ) : (
                <span className="text-xs text-red-500">Out of stock</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
