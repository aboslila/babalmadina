"use client";

import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { state, dispatch } = useCart();
  const { t } = useLanguage();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);

  const total = state.items.reduce((sum, i) => sum + i.cartonPrice * i.quantity, 0);

  async function handleCheckout() {
    setPlacing(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: state.items }),
    });
    const data = await res.json();
    setPlacing(false);

    if (res.ok) {
      dispatch({ type: "CLEAR_CART" });
      router.push(`/bill/${data.orderId}`);
    }
  }

  if (state.items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-gray-500">{t.emptyCart}</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold">
        <span className="text-blue-600">{t.yourCart}</span>
      </h1>

      <div className="flex flex-col gap-3">
        {state.items.map((item) => (
          <div
            key={item.productId}
            className="border border-gray-200 dark:border-gray-800 rounded-2xl p-3 flex items-center gap-4 bg-white dark:bg-gray-950"
          >
            <img
              src={`/products/${item.artNo}.jpg`}
              alt={item.artNo}
              className="w-16 h-16 rounded-lg object-cover bg-gray-100 dark:bg-gray-900 shrink-0"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml;utf8," +
                  encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%23e5e7eb"/></svg>'
                  );
              }}
            />

            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{item.artNo}</p>
              <p dir="rtr" className="text-sm text-green-700 font-medium">
                {item.cartonPrice.toFixed(2)} <span className="text-red-500">دينار ليبي</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => dispatch({ type: "DECREASE_ITEM", productId: item.productId })}
                className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                −
              </button>
              <span className="w-6 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() =>
                  dispatch({
                    type: "ADD_ITEM",
                    item: { ...item, quantity: 1 },
                  })
                }
                className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                +
              </button>
              <button
                onClick={() => dispatch({ type: "REMOVE_ITEM", productId: item.productId })}
                className="text-red-600 text-xs ml-1 hover:underline"
              >
                {t.remove}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center font-bold text-lg pt-4 border-t border-gray-200 dark:border-gray-800">
        <span>{t.total}</span>
        <span dir="rtr" className="text-green-700">
          {total.toFixed(2)} <span className="text-sm text-red-500">دينار ليبي</span>
        </span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={placing}
        className="bg-red-600 hover:bg-red-700 text-white rounded-full py-3 font-semibold transition-colors disabled:opacity-50"
      >
        {placing ? t.placingOrder : t.confirmOrder}
      </button>
    </main>
  );
}