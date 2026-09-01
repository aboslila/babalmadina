"use client";

import { useState } from "react";
import { Product } from "@/lib/db";
import { ProductCard, ProductPopup } from "../ProductCard";
import {
  getCategoryGroup,
  categoryGroupLabels,
  CategoryGroup,
} from "@/lib/category-group";

const GROUPS: (CategoryGroup | "all")[] = [
  "all",
  "men",
  "lady",
  "boy",
  "child",
  "baby",
];

export default function ProductsPageClient({
  products,
}: {
  products: Product[];
}) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<CategoryGroup | "all">("all");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = products.filter((p) => {
    const matchesQuery = p.art_no
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    const matchesGroup =
      group === "all" || getCategoryGroup(p.category) === group;
    return matchesQuery && matchesGroup;
  });

  return (
    <>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحث برقم المنتج (ArtNo)"
        className="w-full border border-gray-300 rounded-full px-4 py-2 mb-4 text-sm"
        dir="ltr"
      />

      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {GROUPS.map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              group === g
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {g === "all" ? "الكل" : categoryGroupLabels[g]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={() => setSelected(product)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 mt-10">لا توجد نتائج</p>
      )}

      {selected && (
        <ProductPopup product={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
