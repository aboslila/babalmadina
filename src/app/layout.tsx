import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { LanguageProvider } from "@/lib/language-context";
import Header from "./Header";
import BottomNav from "./BottomNav";

export const metadata: Metadata = {
  title: "Toobaco",
  description: "Wholesale store",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-black pb-16">
        <LanguageProvider>
          <CartProvider>
            <Header />
            {children}
            <BottomNav />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
