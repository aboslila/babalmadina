"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Language = "en" | "ar";

const translations = {
  en: {
    ourProducts: "Our Products",
    welcome: "Welcome",
    addToCart: "Add to Cart",
    added: "Added",
    cart: "Cart",
    yourCart: "Your Cart",
    total: "Total",
    confirmOrder: "Confirm Order",
    emptyCart: "Your cart is empty.",
    placingOrder: "Placing order...", 
    remove: "Remove",
    each: "Each"
  },
  ar: {
    ourProducts: "منتجاتنا",
    welcome: "مرحباً",
    addToCart: "أضف إلى السلة",
    added: "تمت الإضافة",
    cart: "السلة",
    yourCart: "سلتك",
    total: "المجموع",
    confirmOrder: "تأكيد الطلب",
    emptyCart: "سلتك فارغة.",
    placingOrder: "جاري تأكيد الطلب...",
    remove: "إزالة",
    each: "للقطعة"
  },
};

const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: typeof translations["en"];
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  // Whenever lang changes, flip the whole document's direction.
  // This is what actually mirrors the layout for Arabic.
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}