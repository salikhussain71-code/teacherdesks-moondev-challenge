"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Something went wrong</h1>
        <p role="alert" className="mt-2 text-slate-700">{error.message}</p>
        <button onClick={reset} className="mt-4 rounded bg-teal-800 px-4 py-2 text-white">Try again</button>
      </div>
    </main>
  );
}
