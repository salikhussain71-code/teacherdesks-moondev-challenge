import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PAID GATE #2 (server-enforced): CSV export is Pro-only.
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("tier").eq("id", user.id).maybeSingle();
  if (profile?.tier !== "pro") {
    return NextResponse.json({ error: "CSV export requires the Pro plan." }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("invoices").select("client_name, amount, due_date, status, notes").order("due_date");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Escape quotes and neutralise spreadsheet formula injection (=, +, -, @).
  const cell = (v: unknown) => {
    let s = String(v ?? "");
    if (/^[=+\-@]/.test(s)) s = "'" + s;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const rows = [["Client", "Amount", "Due date", "Status", "Notes"].map(cell).join(",")];
  for (const r of data ?? []) {
    rows.push([r.client_name, r.amount, r.due_date, r.status, r.notes].map(cell).join(","));
  }
  return new NextResponse(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="chaselog-invoices.csv"',
    },
  });
}
