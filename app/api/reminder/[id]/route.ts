import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PAID GATE #3 (server-enforced): ready-to-send reminder text is Pro-only.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid invoice id." }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("tier").eq("id", user.id).maybeSingle();
  if (profile?.tier !== "pro") {
    return NextResponse.json({ error: "Reminder messages require the Pro plan." }, { status: 403 });
  }

  // RLS guarantees users can only read their own invoices.
  const { data: inv, error } = await supabase.from("invoices").select("*").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!inv) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });

  const days = Math.floor((Date.now() - new Date(inv.due_date + "T00:00:00Z").getTime()) / 86400000);
  const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(inv.amount));
  const tone = days > 30
    ? "This invoice is now more than 30 days overdue, so I need to know when payment will be made."
    : "Could you let me know when I can expect payment?";
  const text = days > 0
    ? `Hi ${inv.client_name},\n\nA quick reminder that my invoice for ${amount} was due on ${inv.due_date} and is now ${days} day${days === 1 ? "" : "s"} overdue. ${tone}\n\nThank you,`
    : `Hi ${inv.client_name},\n\nA friendly heads-up that my invoice for ${amount} is due on ${inv.due_date}.\n\nThank you,`;
  return new NextResponse(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
