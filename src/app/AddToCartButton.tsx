"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";

type Props = {
  productId: number;
  artNo: string;
  cartonPrice: number;
  stock: number;
};

export default function AddToCartButton({
  productId,
  artNo,
  cartonPrice,
  stock,
}: Props) {
  const { state, dispatch } = useCart();
  const { t } = useLanguage();
  const [added, setAdded] = useState(false);

  const inCart =
    state.items.find((i) => i.productId === productId)?.quantity ?? 0;
  const soldOut = stock <= 0;
  const maxedOut = !soldOut && inCart >= stock;

  function handleClick() {
    if (soldOut || maxedOut) return;

    dispatch({
      type: "ADD_ITEM",
      item: { productId, artNo, cartonPrice, quantity: 1, stock },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  }

  if (soldOut) {
    return (
      <button
        type="button"
        disabled
        className="rounded px-3 py-1 text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
      >
        غير متوفر
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={maxedOut}
      className={`
        rounded px-3 py-1 text-sm font-medium text-white 
        transition-all duration-200 ease-in-out
        hover:scale-105 hover:shadow-md
        ${maxedOut ? "bg-gray-400 cursor-not-allowed" : added ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
      `}
    >
      {maxedOut
        ? `الحد الأقصى ${stock}`
        : added
          ? `${t.added} ✓`
          : t.addToCart}
    </button>
  );
}
