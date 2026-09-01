"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "الرئيسية", icon: "🏠" },
    { href: "/products", label: "المنتجات", icon: "🛍️" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 flex justify-around py-2">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-6 py-1 text-xs font-medium transition-colors ${
              active ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
