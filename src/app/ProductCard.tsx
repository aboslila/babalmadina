"use client";

import { useEffect } from "react";
import { Product } from "@/lib/db";
import AddToCartButton from "./AddToCartButton";
import ProductImage from "./ProductImage";

export function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className="group border border-gray-200 rounded-2xl p-4 flex flex-col gap-2 bg-white hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105 cursor-pointer"
    >
      <div className="bg-gray-100 h-40 rounded-xl overflow-hidden">
        <ProductImage artNo={product.art_no} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold mt-1">{product.art_no}</h2>
        <span
          className={`shrink-0 text-2xs font-medium px-2 py-0.5 rounded-full ${
            product.stock > 0
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {product.stock > 0
            ? `متوفر: ${product.stock} قطعة`
            : "غير متوفر"}
        </span>
      </div>
      <p className="text-1xl uppercase tracking-wide text-black font-medium">
        {product.category}
      </p>
      <p className="text-sm text-gray-800">{product.pack} قطعة / كرتون</p>
      <div className="flex items-baseline justify-between pt-2">
        <div className="flex items-baseline gap-1">
          <span dir="ltr" className="font-bold text-lg text-black-800">
            {product.carton_price.toFixed(2)} 
          </span>
          <span className="text-xm text-black-200">د.ل</span>
        </div>
        <span dir="rtl" className="text-xm text-black-800">
          {product.unit_price.toFixed(2)} <span className="test-xm text-black"> د.ل / قطعة  </span> 
        </span>
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <AddToCartButton
          productId={product.id}
          artNo={product.art_no}
          cartonPrice={product.carton_price}
          stock={product.stock}
        />
      </div>
    </div>
  );
}

export function ProductPopup({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 max-w-md w-full flex flex-col gap-3 shadow-2xl animate-[popIn_0.2s_ease-out]"
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        <div className="bg-gray-100 h-64 rounded-2xl overflow-hidden -mt-4">
          <ProductImage artNo={product.art_no} />
        </div>

        <h2 className="font-bold text-xl mt-2">{product.art_no}</h2>
        <p className="text-lm uppercase tracking-wide text-black font-medium">
          {product.category}
        </p>
        <p className="text-xl text-black">{product.pack} قطعة / كرتون</p>
        <p
          className={`text-lg font-medium ${
            product.stock > 0 ? "text-green-700" : "text-red-600"
          }`}
        >
          {product.stock > 0
            ? `الكمية المتوفرة: ${product.stock} قطعة`
            : "غير متوفر حالياً"}
        </p>

        <div className="flex items-baseline justify-between pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-1">
            <span dir="ltr" className="font-bold text-2xl text-black">
              {product.carton_price.toFixed(2)}
            </span>
            <span className="text-xl text-black">د.ل</span>
          </div>
          <span dir="rtl" className="text-xl text-black">
            {product.unit_price.toFixed(2)}{" "} 
            <span className="test-xm text-black"> د.ل / قطعة </span>
          </span>
        </div>

        <AddToCartButton
          productId={product.id}
          artNo={product.art_no}
          cartonPrice={product.carton_price}
          stock={product.stock}
        />
      </div>
    </div>
  );
}
