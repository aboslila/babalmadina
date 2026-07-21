import { redirect } from "next/navigation";
import { db, Product } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/auth";
import AddToCartButton from "./AddToCartButton";

export default async function HomePage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/login");

const products = db
  .prepare("SELECT * FROM products WHERE stock > 0 ORDER BY id")
  .all() as Product[];

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <p className="text-sm text-gray-500">Welcome, {customer.full_name}</p>
      </div>

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
            <AddToCartButton
              productId={product.id}
              name={product.name}
              price={product.price}
            />
          </div>
        ))}
      </div>
    </main>
  );
}