"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/db";

export default function AdminDashboardClient({
  products,
}: {
  products: Product[];
}) {
  const router = useRouter();

  const excelInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [excelStatus, setExcelStatus] = useState("");
  const [imageStatus, setImageStatus] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [savingStock, setSavingStock] = useState(false);

  // Only the quantities the admin actually changed, keyed by product id.
  // Anything absent falls back to the value the server sent, so a fresh
  // product list (after an import or refresh) never needs a syncing effect.
  const [overrides, setOverrides] = useState<Record<number, number>>({});

  const valueFor = (product: Product) =>
    overrides[product.id] ?? product.stock;

  const dirty = products.some((p) => {
    const override = overrides[p.id];
    return override !== undefined && override !== p.stock;
  });

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function handleExcelSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setExcelFile(e.target.files?.[0] ?? null);
    setExcelStatus("");
  }

  function clearExcelFile() {
    setExcelFile(null);
    if (excelInputRef.current) excelInputRef.current.value = "";
  }

  function handleImagesSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setImageFiles(e.target.files ? Array.from(e.target.files) : []);
    setImageStatus("");
  }

  function clearImageFiles() {
    setImageFiles([]);
    if (imagesInputRef.current) imagesInputRef.current.value = "";
  }

  function setQuantity(id: number, value: string) {
    if (value === "") {
      setOverrides((o) => ({ ...o, [id]: 0 }));
      return;
    }
    const parsed = Math.floor(Number(value));
    if (Number.isNaN(parsed)) return;
    setOverrides((o) => ({ ...o, [id]: Math.max(0, parsed) }));
  }

  async function handleStockSave(e: React.FormEvent) {
    e.preventDefault();
    setStockStatus("");

    const items = products.map((p) => ({
      id: p.id,
      stock: valueFor(p),
    }));

    setSavingStock(true);
    const res = await fetch("/api/admin/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const data = await res.json().catch(() => ({}));
    setSavingStock(false);

    if (res.ok) {
      setStockStatus("تم حفظ الكميات المتوفرة بنجاح");
      setOverrides({});
      router.refresh();
    } else {
      setStockStatus(data.error ?? "تعذّر الحفظ");
    }
  }

  async function handleExcelUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!excelFile) return;

    const formData = new FormData();
    formData.append("file", excelFile);

    setUploadingExcel(true);
    setExcelStatus("");
    const res = await fetch("/api/admin/upload-excel", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploadingExcel(false);

    if (res.ok) {
      setExcelStatus(`تم استيراد ${data.count} منتج بنجاح`);
      clearExcelFile();
      router.refresh();
    } else {
      setExcelStatus(data.error);
    }
  }

  async function handleImagesUpload(e: React.FormEvent) {
    e.preventDefault();
    if (imageFiles.length === 0) return;

    const formData = new FormData();
    for (const file of imageFiles) {
      formData.append("files", file);
    }

    setUploadingImages(true);
    setImageStatus("");
    const res = await fetch("/api/admin/upload-images", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploadingImages(false);

    if (res.ok) {
      setImageStatus(`تم رفع ${data.saved} صورة بنجاح`);
      clearImageFiles();
    } else {
      setImageStatus(data.error);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">لوحة التحكم</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          تسجيل الخروج
        </button>
      </div>

      {/* Available quantities */}
      <form
        onSubmit={handleStockSave}
        className="border border-gray-200 rounded-2xl p-5 flex flex-col gap-3 bg-white"
      >
        <h2 className="font-semibold">الكميات المتوفرة</h2>
        <p className="text-xs text-gray-500">
          حدّد عدد القطع المتوفرة لكل منتج. المنتجات ذات الكمية صفر لا تظهر
          للعملاء.
        </p>

        {products.length === 0 ? (
          <p className="text-sm text-gray-500">
            لا توجد منتجات. ارفع ملف Excel أولاً.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-gray-100">
            {products.map((product) => {
              const value = valueFor(product);

              return (
                <div
                  key={product.id}
                  className="flex items-center gap-3 py-2.5"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.art_no}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {product.category ?? "—"} · {product.pack} قطعة / كرتون
                    </p>
                  </div>

                  <input
                    type="number"
                    min={0}
                    step={1}
                    inputMode="numeric"
                    value={value}
                    onChange={(e) => setQuantity(product.id, e.target.value)}
                    className="w-20 shrink-0 border border-gray-300 rounded-lg px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`الكمية المتوفرة لـ ${product.art_no}`}
                  />

                  <span className="text-xs text-gray-400 shrink-0">قطعة</span>

                  <button
                    type="button"
                    onClick={() => setQuantity(product.id, "0")}
                    className="shrink-0 text-xs text-gray-400 hover:text-red-600 transition-colors"
                  >
                    نفدت
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <button
          type="submit"
          disabled={!dirty || savingStock || products.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full py-2 font-semibold transition-colors disabled:opacity-40"
        >
          {savingStock ? "جاري الحفظ..." : "حفظ الكميات"}
        </button>

        {stockStatus && <p className="text-sm text-gray-600">{stockStatus}</p>}
      </form>

      {/* Excel upload */}
      <form
        onSubmit={handleExcelUpload}
        className="border border-gray-200 rounded-2xl p-5 flex flex-col gap-3 bg-white"
      >
        <h2 className="font-semibold">تحديث المنتجات (ملف Excel)</h2>
        <p className="text-xs text-gray-500">
          الأسعار تُحدَّث من الملف، أما الكميات المتوفرة فتبقى كما هي.
        </p>

        <label className="cursor-pointer w-fit bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl px-4 py-2 text-sm font-medium transition-colors">
          اختيار الملف
          <input
            ref={excelInputRef}
            type="file"
            accept=".xlsx"
            onChange={handleExcelSelect}
            className="hidden"
          />
        </label>

        {excelFile && (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
            <span className="truncate">{excelFile.name}</span>
            <button
              type="button"
              onClick={clearExcelFile}
              className="text-gray-400 hover:text-red-600 shrink-0 ml-2"
              aria-label="إزالة الملف"
            >
              ✕
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={!excelFile || uploadingExcel}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full py-2 font-semibold transition-colors disabled:opacity-40"
        >
          {uploadingExcel ? "جاري الرفع..." : "رفع الملف"}
        </button>

        {excelStatus && <p className="text-sm text-gray-600">{excelStatus}</p>}
      </form>

      {/* Images upload */}
      <form
        onSubmit={handleImagesUpload}
        className="border border-gray-200 rounded-2xl p-5 flex flex-col gap-3 bg-white"
      >
        <h2 className="font-semibold">رفع صور المنتجات</h2>
        <p className="text-xs text-gray-500">
          يجب أن يكون اسم كل صورة مطابقاً لرقم المنتج (ArtNo) مثل: ALRB38331.jpg
        </p>

        <label className="cursor-pointer w-fit bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl px-4 py-2 text-sm font-medium transition-colors">
          اختيار الصور
          <input
            ref={imagesInputRef}
            type="file"
            accept=".jpg"
            multiple
            onChange={handleImagesSelect}
            className="hidden"
          />
        </label>

        {imageFiles.length > 0 && (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
            <span>تم اختيار {imageFiles.length} صورة</span>
            <button
              type="button"
              onClick={clearImageFiles}
              className="text-gray-400 hover:text-red-600 shrink-0 ml-2"
              aria-label="إزالة الصور"
            >
              ✕
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={imageFiles.length === 0 || uploadingImages}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full py-2 font-semibold transition-colors disabled:opacity-40"
        >
          {uploadingImages ? "جاري الرفع..." : "رفع الصور"}
        </button>

        {imageStatus && <p className="text-sm text-gray-600">{imageStatus}</p>}
      </form>
    </main>
  );
}
