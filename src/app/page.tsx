import { redirect } from "next/navigation";
import { db, Product } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/auth";
import AddToCartButton from "./AddToCartButton";
import PageHeading from "./PageHeading";

export default async function HomePage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/login");

  const products = db
    .prepare("SELECT * FROM products WHERE stock > 0 ORDER BY id")
    .all() as Product[];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <PageHeading customerName={customer.full_name} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col gap-2 bg-white dark:bg-gray-950 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
          >
            <div className="bg-gray-100 dark:bg-gray-900 h-40 rounded-xl flex items-center justify-center text-gray-400 text-sm overflow-hidden">
              {product.image_url ?? "No image"}
            </div>
            <h2 className="font-semibold mt-1">{product.name}</h2>
            <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-medium">
              {product.category}
            </p>
            <p className="text-sm text-gray-500 flex-1">{product.description}</p>
            <div className="pt-2 flex items-baseline gap-1">
              <span dir="ltr" className="font-bold text-lg text-green-600">
                {product.price.toFixed(2)}
              </span>
              <span className="text-sm text-red-800">دينار ليبي</span>
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