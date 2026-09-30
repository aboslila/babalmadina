"use client";

import { useDeferredValue, useState } from "react";
import { Product } from "@/lib/db";
import { ProductCard, ProductPopup } from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);

  // Keeps typing responsive if the catalog grows large: the input updates
  // immediately while the filtering catches up.
  const deferredQuery = useDeferredValue(query);
  const term = deferredQuery.trim().toLowerCase();

  const filtered = term
    ? products.filter((p) => p.art_no.toLowerCase().includes(term))
    : products;

  function handleSearch(value: string) {
    setQuery(value);
    // Close the popup so it can never show a product that no longer matches.
    setSelected(null);
  }

  return (
    <>
      <div className="relative mb-6">
        <span className="absolute inset-y-0 start-4 flex items-center text-gray-400 pointer-events-none">
          🔍
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="ابحث برقم المنتج مثل ACXC23371"
          aria-label="البحث عن منتج برقم المنتج"
          dir="rtl"
          className="w-full bg-gray-100 border border-gray-200 rounded-full ps-11 pe-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
        />

        {query && (
          <button
            type="button"
            onClick={() => handleSearch("")}
            aria-label="مسح البحث"
            className="absolute inset-y-0 end-4 flex items-center text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      {term && (
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length > 0
            ? `تم العثور على ${filtered.length} منتج`
            : "لا توجد نتائج"}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={() => setSelected(product)}
          />
        ))}
      </div>

      {selected && (
        <ProductPopup product={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
