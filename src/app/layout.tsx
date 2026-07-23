import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import ThemeProvider from "./ThemeProvider";
import Header from "./Header";
import { LanguageProvider } from "@/lib/language-context";

export const metadata: Metadata = {
  title: "Toobaco",
  description: "Wholesale store",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white dark:bg-black text-black dark:text-white">
        <ThemeProvider>
          <LanguageProvider>
            <CartProvider>
              <Header />
              {children}
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}