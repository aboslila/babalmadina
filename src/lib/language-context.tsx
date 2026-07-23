"use client";

import { createContext, useContext, ReactNode } from "react";

const translations = {
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
  each: "للقطعة",
};

const LanguageContext = createContext<{ t: typeof translations } | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <LanguageContext.Provider value={{ t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}