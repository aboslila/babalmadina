"use client";

import { useLanguage } from "@/lib/language-context";

export default function PageHeading({ customerName }: { customerName: string }) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between mb-10 border-b border-blue-100 dark:border-blue-950 pb-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t.ourProducts}</h1>
        <p dir="rtl" className="text-sm text-gray-700 mt-1">متجر جملة</p>
      </div>
      <p dir="rtl" className="text-sm bg-blue-600/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full font-medium">
        {t.welcome}, {customerName}
      </p>
    </div>
  );
}