import { db, Product } from "@/lib/db";
import AddToCartButton from "./AddToCartButton";
import ProductImage from "./ProductImage";
import PageHeading from "./PageHeading";

export default async function HomePage() {
  const products = db
    .prepare("SELECT * FROM products WHERE stock > 0 ORDER BY id")
    .all() as Product[];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <PageHeading />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group border border-gray-200 rounded-2xl p-4 flex flex-col gap-2 bg-white hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
          >
            <div className="bg-gray-100 h-40 rounded-xl overflow-hidden">
              <ProductImage artNo={product.art_no} />
            </div>
            <h2 className="font-semibold mt-1">{product.art_no}</h2>
            <p className="text-xs uppercase tracking-wide text-blue-600 font-medium">
              {product.category}
            </p>
            <p className="text-sm text-gray-500">{product.pack} قطعة / كرتون</p>
            <div className="flex items-baseline justify-between pt-2">
              <div className="flex items-baseline gap-1">
                <span dir="ltr" className="font-bold text-lg text-red-600">
                  {product.carton_price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">دينار ليبي</span>
              </div>
              <span dir="ltr" className="text-xs text-gray-400">
                {product.unit_price.toFixed(2)} د.ل / قطعة
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
