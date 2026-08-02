"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";

export default function Header() {
  const { state } = useCart();
  const { t } = useLanguage();

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link
        href="/"
        className="font-extrabold text-xl hover:opacity-80 transition-opacity"
      >
        <span className="text-red-600">Tooba</span>
        <span className="text-blue-600">co</span>
      </Link>

      <Link
        href="/cart"
        className="relative flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
      >
        🛒 {t.cart}
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>
    </header>
  );
}
