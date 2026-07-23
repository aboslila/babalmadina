"use client";

import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";

export default function CartPage() {
  const { t } = useLanguage();
  const { state, dispatch } = useCart();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);

  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

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
    return <main className="max-w-2xl mx-auto px-4 py-10">{t.emptyCart}</main>;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-4">
      <h1 className="text-2xl font-bold"> {t.yourCart} </h1>

      {state.items.map((item) => (
        <div key={item.productId} className="border rounded p-3 flex items-center justify-between">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-500">${item.price.toFixed(2)} {t.each} </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch({ type: "DECREASE_ITEM", productId: item.productId })}
              className="border rounded px-2"
            >
              −
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() =>
                dispatch({
                  type: "ADD_ITEM",
                  item: { ...item, quantity: 1 },
                })
              }
              className="border rounded px-2"
            >
              +
            </button>
            <button
              onClick={() => dispatch({ type: "REMOVE_ITEM", productId: item.productId })}
              className="text-red-600 text-sm ml-2"
            >
              {t.remove}
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between font-bold text-lg pt-4 border-t">
        <span> {t.total} </span>
        <span>${total.toFixed(2)}</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={placing}
        className="bg-blue-600 text-white rounded py-3 font-medium disabled:opacity-50"
      >
        {placing ? t.placingOrder : t.confirmOrder}
      </button>
    </main>
  );
}