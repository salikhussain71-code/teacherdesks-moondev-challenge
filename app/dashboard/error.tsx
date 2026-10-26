"use client";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-slate-900">That action failed</h1>
      <p role="alert" className="mt-2 text-slate-700">{error.message}</p>
      <button onClick={reset} className="mt-4 rounded bg-teal-800 px-4 py-2 text-white">Try again</button>
    </main>
  );
}
