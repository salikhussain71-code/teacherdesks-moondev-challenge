"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return setError(error.message);
        if (!data.session) return setInfo("Account created. Check your email to confirm, then log in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return setError(error.message);
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network problem. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm font-semibold text-teal-800">ChaseLog</Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          {mode === "login" ? "Log in" : "Create your account"}
        </h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm text-slate-700">Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-2 focus:outline-teal-700" />
          </label>
          <label className="block text-sm text-slate-700">Password
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-2 focus:outline-teal-700" />
          </label>
          {error && <p role="alert" className="rounded bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
          {info && <p role="status" className="rounded bg-teal-50 px-3 py-2 text-sm text-teal-900">{info}</p>}
          <button disabled={loading}
            className="w-full rounded bg-teal-800 px-4 py-2 font-medium text-white hover:bg-teal-900 disabled:opacity-60">
            {loading ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>
        <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setInfo(null); }}
          className="mt-4 text-sm text-slate-600 underline">
          {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
        </button>
      </div>
    </main>
  );
}
