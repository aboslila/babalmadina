"use client";

import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";

const WHATSAPP_NUMBER = "218913150612"; // TODO: replace with the client's real number

export default function CartPage() {
  const { state, dispatch } = useCart();
  const { t } = useLanguage();

  const total = state.items.reduce(
    (sum, i) => sum + i.cartonPrice * i.quantity,
    0,
  );

  function buildWhatsAppLink() {
    const lines = state.items.map(
      (item) => `${item.artNo} × ${item.quantity} كرتون`,
    );
    const message = `مرحباً، أريد طلب:\n${lines.join("\n")}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function handleCheckout() {
    window.open(buildWhatsAppLink(), "_blank");
    dispatch({ type: "CLEAR_CART" });
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
            className="border border-gray-200 rounded-2xl p-3 flex items-center gap-4 bg-white"
          >
            <img
              src={`/products/${item.artNo}.jpg`}
              alt={item.artNo}
              className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{item.artNo}</p>
              <p dir="ltr" className="text-sm text-red-600 font-medium">
                {item.cartonPrice.toFixed(2)}{" "}
                <span className="text-gray-500">دينار ليبي</span>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  dispatch({ type: "DECREASE_ITEM", productId: item.productId })
                }
                className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                −
              </button>
              <span className="w-6 text-center font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  dispatch({ type: "ADD_ITEM", item: { ...item, quantity: 1 } })
                }
                className="w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
              <button
                onClick={() =>
                  dispatch({ type: "REMOVE_ITEM", productId: item.productId })
                }
                className="text-red-600 text-xs ml-1 hover:underline"
              >
                {t.remove}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center font-bold text-lg pt-4 border-t border-gray-200">
        <span>{t.total}</span>
        <span dir="ltr" className="text-blue-600">
          {total.toFixed(2)}{" "}
          <span className="text-sm text-gray-500">دينار ليبي</span>
        </span>
      </div>

      <button
        onClick={handleCheckout}
        className="bg-green-600 hover:bg-green-700 text-white rounded-full py-3 font-semibold transition-colors flex items-center justify-center gap-2"
      >
        📱 إرسال الطلب عبر واتساب
      </button>
    </main>
  );
}
