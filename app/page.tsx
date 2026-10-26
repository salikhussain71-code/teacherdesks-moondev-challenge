import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 text-slate-900">
      <p className="font-semibold text-teal-800">ChaseLog</p>
      <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
        Know which client invoice to chase today.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-slate-700">
        A simple tracker for freelancers. Log what each client owes, see what is overdue the moment it slips,
        and mark it paid when the money lands.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/login" className="rounded bg-teal-800 px-5 py-3 font-medium text-white hover:bg-teal-900">Start free</Link>
      </div>
      <p className="mt-6 text-sm text-slate-600">Free: up to 5 invoices. Pro: unlimited invoices, CSV export and ready-to-send reminder messages.</p>
    </main>
  );
}
