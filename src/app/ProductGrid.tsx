"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/db";
import AddToCartButton from "./AddToCartButton";
import ProductImage from "./ProductImage";

export default function ProductGrid({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = products.filter((p) =>
    p.art_no.toLowerCase().includes(query.trim().toLowerCase()),
  );

  // Close the popup with the Escape key, and prevent background scroll while it's open.
  useEffect(() => {
    if (!selected) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحث برقم المنتج (ArtNo)"
        className="w-full border border-blue-800 text-red-800 rounded-full px-4 py-2 mb-8 text-sm"
        dir="ltr"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelected(product)}
            className="group border border-red-800 rounded-2xl p-4 flex flex-col gap-2 bg-white hover:border-blue-800 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <div className="bg-gray-100 h-40 rounded-xl overflow-hidden">
              <ProductImage artNo={product.art_no} />
            </div>
            <h2 className="font-semibold mt-1">{product.art_no}</h2>
            <p className="text-xs uppercase tracking-wide text-blue-800 font-medium">
              {product.category}
            </p>
            <p className="text-sm text-gray-800">{product.pack} قطعة / كرتون</p>
            <div className="flex items-baseline justify-between pt-2">
              <div className="flex items-baseline gap-1">
                <span dir="ltr" className="font-bold text-lg text-red-800">
                  {product.carton_price.toFixed(2)}
                </span>
                <span className="text-sm text-green-800">دينار ليبي</span>
                <span> </span>
              </div>
              <span dir="rtl" className="text-xs text-gray-400">
                {product.unit_price.toFixed(2)} قطعة / د.ل
              </span>
            </div>
            {/* Stop the click from also opening the popup when the button itself is pressed */}
            <div onClick={(e) => e.stopPropagation()}>
              <AddToCartButton
                productId={product.id}
                artNo={product.art_no}
                cartonPrice={product.carton_price}
              />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 mt-10">لا توجد نتائج</p>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full flex flex-col gap-3 shadow-2xl animate-[popIn_0.2s_ease-out]"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="text-blue-800 hover:text-red-800 text-xl leading-none"
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>

            <div className="bg-gray-100 h-64 rounded-2xl overflow-hidden -mt-4">
              <ProductImage artNo={selected.art_no} />
            </div>

            <h2 className="font-bold text-xl mt-2">{selected.art_no}</h2>
            <p className="text-sm uppercase tracking-wide text-blue-800 font-medium">
              {selected.category}
            </p>
            <p className="text-sm text-gray-800">
              {selected.pack} قطعة / كرتون
            </p>

            <div className="flex items-baseline justify-between pt-2 border-t border-gray-100">
              <div className="flex items-baseline gap-1">
                <span dir="ltr" className="font-bold text-2xl text-red-800">
                  {selected.carton_price.toFixed(2)}
                </span>
                <span className="text-sm text-green-800">دينار ليبي</span>
              </div>
              <span dir="rtl" className="text-sm text-gray-800">
                {selected.unit_price.toFixed(2)} قطعة / د.ل
              </span>
            </div>

            <AddToCartButton
              productId={selected.id}
              artNo={selected.art_no}
              cartonPrice={selected.carton_price}
            />
          </div>
        </div>
      )}
    </>
  );
}
