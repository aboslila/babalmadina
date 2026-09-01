"use client";

import { useState } from "react";
import { Product } from "@/lib/db";
import { ProductCard, ProductPopup } from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
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
