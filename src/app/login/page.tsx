"use client";

// "use client" here because this component needs onSubmit, useState, and
// fetch — none of that can run in a Server Component. Rule of thumb we'll
// keep using: Server Component by default, "use client" only when a file
// needs interactivity, browser APIs, or hooks like useState/useEffect.

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
      setError(data.error ?? "Login failed");
      return;
    }

    router.push("/");
    router.refresh(); // forces the Server Component tree to re-fetch with the new session
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border rounded-lg p-6 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center">Toobaco</h1>
        <p className="text-sm text-gray-500 text-center">Wholesale customer login</p>

        <input
          className="border rounded px-3 py-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white rounded py-2 font-medium disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </main>
  );
}
