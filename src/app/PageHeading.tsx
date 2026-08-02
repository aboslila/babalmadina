"use client";

import { useLanguage } from "@/lib/language-context";

export default function PageHeading() {
  const { t } = useLanguage();

  return (
    <div className="mb-10 border-b border-blue-100 pb-6">
      <h1 className="text-3xl font-extrabold tracking-tight">
        {t.ourProducts}
      </h1>
      <p className="text-sm text-gray-500 mt-1">الكتالوج بالجملة</p>
    </div>
  );
}
