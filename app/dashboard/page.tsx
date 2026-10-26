import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AddInvoiceForm from "@/components/AddInvoiceForm";
import { changePlan, deleteInvoice, setStatus, signOut } from "@/app/actions";

const FREE_LIMIT = 5;
const daysLate = (due: string, today: string) =>
  Math.floor((Date.parse(today) - Date.parse(due)) / 86400000);
const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: invoices, error }] = await Promise.all([
    supabase.from("profiles").select("tier").eq("id", user.id).maybeSingle(),
    supabase.from("invoices").select("*").order("due_date", { ascending: true }),
  ]);

  const isPro = profile?.tier === "pro";
  const list = invoices ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const pending = list.filter((i) => i.status === "pending");
  const overdue = pending.filter((i) => i.due_date < today);
  const outstanding = pending.reduce((s, i) => s + Number(i.amount), 0);
  const overdueTotal = overdue.reduce((s, i) => s + Number(i.amount), 0);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 text-slate-900">
      <header className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-teal-800">ChaseLog</p>
          <p className="text-sm text-slate-600">{user.email}</p>
        </div>
        <form action={signOut}><button className="text-sm underline text-slate-700">Log out</button></form>
      </header>

      {error && <p role="alert" className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-800">Could not load invoices: {error.message}</p>}

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Waiting to be paid</p>
          <p className="mt-1 text-2xl font-semibold">{money(outstanding)}</p>
        </div>
        <div className="rounded border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-900">Overdue — chase these</p>
          <p className="mt-1 text-2xl font-semibold text-red-900">{money(overdueTotal)}</p>
          <p className="text-sm text-red-900">{overdue.length} invoice{overdue.length === 1 ? "" : "s"}</p>
        </div>
        <div className="rounded border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Plan</p>
          <p className="mt-1 text-2xl font-semibold">{isPro ? "Pro" : "Free"}</p>
          {!isPro && <p className="text-sm text-slate-600">{list.length}/{FREE_LIMIT} invoices used</p>}
          <form action={changePlan} className="mt-2">
            <input type="hidden" name="tier" value={isPro ? "free" : "pro"} />
            <button className="text-sm font-medium text-teal-800 underline">
              {isPro ? "Switch back to Free (demo)" : "Upgrade to Pro (demo, no payment)"}
            </button>
          </form>
        </div>
      </section>

      <section className="mt-8 rounded border border-slate-200 bg-white p-4">
        <h2 className="mb-3 font-semibold">Add an invoice</h2>
        <AddInvoiceForm />
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Your invoices</h2>
          {isPro ? (
            <a href="/api/export" className="rounded border border-teal-800 px-3 py-1 text-sm text-teal-900 hover:bg-teal-50">Export CSV</a>
          ) : (
            <span className="text-sm text-slate-500">CSV export is a Pro feature</span>
          )}
        </div>
        {list.length === 0 ? (
          <p className="rounded border border-dashed border-slate-300 p-6 text-center text-slate-600">
            No invoices yet. Add the first one above and ChaseLog will flag it the day it goes overdue.
          </p>
        ) : (
          <div className="overflow-x-auto rounded border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr><th className="p-3">Client</th><th className="p-3">Amount</th><th className="p-3">Due</th><th className="p-3">Late by</th><th className="p-3">Status</th><th className="p-3"></th></tr>
              </thead>
              <tbody>
                {list.map((i) => {
                  const isOverdue = i.status === "pending" && i.due_date < today;
                  return (
                    <tr key={i.id} className="border-t border-slate-200">
                      <td className="p-3"><p className="font-medium">{i.client_name}</p>{i.notes && <p className="text-slate-500">{i.notes}</p>}</td>
                      <td className="p-3">{money(Number(i.amount))}</td>
                      <td className="p-3">{i.due_date}</td>
                      <td className="p-3">{isOverdue ? `${daysLate(i.due_date, today)} days` : "—"}</td>
                      <td className="p-3">
                        <span className={`rounded px-2 py-0.5 ${i.status === "paid" ? "bg-teal-100 text-teal-900" : isOverdue ? "bg-red-100 text-red-900" : "bg-amber-100 text-amber-900"}`}>
                          {i.status === "paid" ? "Paid" : isOverdue ? "Overdue" : "Pending"}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap text-right">
                        {isOverdue && (isPro
                          ? <a href={`/api/reminder/${i.id}`} target="_blank" rel="noreferrer" className="mr-3 text-slate-800 underline">Reminder text</a>
                          : <span className="mr-3 text-slate-400" title="Pro feature">Reminder (Pro)</span>)}
                        <form action={setStatus} className="inline">
                          <input type="hidden" name="id" value={i.id} />
                          <input type="hidden" name="status" value={i.status === "paid" ? "pending" : "paid"} />
                          <button className="mr-3 text-teal-800 underline">{i.status === "paid" ? "Mark unpaid" : "Mark paid"}</button>
                        </form>
                        <form action={deleteInvoice} className="inline">
                          <input type="hidden" name="id" value={i.id} />
                          <button className="text-red-700 underline">Delete</button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
