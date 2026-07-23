import { redirect } from "next/navigation";
import { db, Product } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/auth";
import AddToCartButton from "./AddToCartButton";
import PageHeading from "./PageHeading";
import ProductImage from "./ProductImage";

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
            <div className="bg-gray-100 dark:bg-gray-900 h-40 rounded-xl overflow-hidden">
              <ProductImage artNo={product.art_no} />
            </div>
            <h2 className="font-semibold mt-1">{product.art_no}</h2>
            <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-medium">
              {product.category}
            </p>
            <p className="text-sm text-gray-800">
              {product.pack} قطعة / كرتون
            </p>
            <div className="flex items-baseline justify-between pt-2">
              <div className="flex items-baseline gap-1">
                <span dir="ltr" className="font-bold text-lg text-green-700">
                  {product.carton_price.toFixed(2)}
                </span>
                <span className="text-sm text-red-800">دينار ليبي</span>
              </div>
              <span dir="rtr" className="text-xs text-gray-800">
                {product.unit_price.toFixed(2)} قطعة / د.ل
              </span>
            </div>
            <AddToCartButton
              productId={product.id}
              artNo={product.art_no}
              cartonPrice={product.carton_price}
            />
          </div>
        ))}
      </div>
    </main>
  );
}