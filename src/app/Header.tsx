"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";

export default function Header() {
  const { state } = useCart();
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-extrabold text-xl hover:opacity-80 transition-opacity">
        <span className="text-red-600">Tooba</span>
        <span className="text-blue-600">co</span>
      </Link>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          className="border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        >
          {lang === "en" ? "AR" : "EN"}
        </button>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        >
          {mounted ? (theme === "dark" ? "☀️" : "🌙") : "…"}
        </button>

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
      </div>
    </header>
  );
}