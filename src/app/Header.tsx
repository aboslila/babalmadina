"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { state } = useCart();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="border-b px-4 py-3 flex items-center justify-between bg-white dark:bg-black">
      <span className="font-bold text-lg text-red-600">Toobaco</span>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="border rounded px-2 py-1 text-sm"
        >
          {mounted ? (theme === "dark" ? "☀️ Light" : "🌙 Dark") : "Theme"}
        </button>

        <Link href="/cart" className="relative text-blue-600 font-medium">
          🛒 Cart
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-red-600 text-white text-xs rounded-full px-1.5">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}