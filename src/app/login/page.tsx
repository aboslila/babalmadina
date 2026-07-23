"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error === "Invalid username or password" ? "اسم المستخدم أو كلمة المرور غير صحيحة" : "حدث خطأ ما");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 bg-white"
      >
        <h1 className="text-2xl font-extrabold text-center">
          <span className="text-red-600">Tooba</span>
          <span className="text-blue-600">co</span>
        </h1>
        <p className="text-sm text-gray-500 text-center">تسجيل دخول العملاء</p>

        <input
          className="border border-gray-300 rounded-xl px-3 py-2"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="border border-gray-300 rounded-xl px-3 py-2"
          placeholder="كلمة المرور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full py-2 font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </button>
      </form>
    </main>
  );
}