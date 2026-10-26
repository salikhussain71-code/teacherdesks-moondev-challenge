"use client";

import { useActionState, useEffect, useRef } from "react";
import { addInvoice, type FormState } from "@/app/actions";

export default function AddInvoiceForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(addInvoice, {});
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => { if (state.ok) ref.current?.reset(); }, [state]);

  const input = "mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-2 focus:outline-teal-700";
  return (
    <form ref={ref} action={action} className="grid gap-3 sm:grid-cols-4">
      <label className="text-sm text-slate-700 sm:col-span-2">Client
        <input name="client_name" required maxLength={120} className={input} placeholder="Acme Studio" />
      </label>
      <label className="text-sm text-slate-700">Amount (USD)
        <input name="amount" type="number" step="0.01" min="0.01" required className={input} />
      </label>
      <label className="text-sm text-slate-700">Due date
        <input name="due_date" type="date" required className={input} />
      </label>
      <label className="text-sm text-slate-700 sm:col-span-4">Notes (optional)
        <input name="notes" maxLength={500} className={input} placeholder="Invoice #, follow-up history…" />
      </label>
      <div className="sm:col-span-4 flex items-center gap-3">
        <button disabled={pending} className="rounded bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900 disabled:opacity-60">
          {pending ? "Saving…" : "Add invoice"}
        </button>
        {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
        {state.ok && <p role="status" className="text-sm text-teal-800">Invoice added.</p>}
      </div>
    </form>
  );
}
