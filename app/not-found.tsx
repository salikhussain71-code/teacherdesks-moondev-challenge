import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">That address does not exist.</p>
        <Link href="/" className="mt-4 inline-block text-teal-800 underline">Back to ChaseLog</Link>
      </div>
    </main>
  );
}
