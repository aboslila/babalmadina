"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardClient() {
  const router = useRouter();

  const excelInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [excelStatus, setExcelStatus] = useState("");
  const [imageStatus, setImageStatus] = useState("");
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

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
    <main className="max-w-xl mx-auto px-4 py-10 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">لوحة التحكم</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          تسجيل الخروج
        </button>
      </div>

      {/* Excel upload */}
      <form
        onSubmit={handleExcelUpload}
        className="border border-gray-200 rounded-2xl p-5 flex flex-col gap-3 bg-white"
      >
        <h2 className="font-semibold">تحديث المنتجات (ملف Excel)</h2>

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
