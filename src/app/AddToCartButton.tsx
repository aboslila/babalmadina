"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";

type Props = {
  productId: number;
  artNo: string;
  cartonPrice: number;
};

export default function AddToCartButton({ productId, artNo, cartonPrice }: Props) {
  const { dispatch } = useCart();
  const { t } = useLanguage();
  const [added, setAdded] = useState(false);

  function handleClick() {
    dispatch({
      type: "ADD_ITEM",
      item: { productId, artNo, cartonPrice, quantity: 1 },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  }

  return (
    <button
      onClick={handleClick}
      className={`
        rounded px-3 py-1 text-sm font-medium text-white 
        transition-all duration-200 ease-in-out
        hover:scale-105 hover:shadow-md
        ${added ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
      `}
    >
      {added ? `${t.added} ✓` : t.addToCart}
    </button>
  );
}