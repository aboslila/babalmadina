"use client";

import { useState } from "react";

export default function ProductImage({ artNo }: { artNo: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
        No image
      </div>
    );
  }

  return (
    <img
      src={`/products/${artNo}.jpg`}
      alt={artNo}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}