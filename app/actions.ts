"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; ok?: boolean };

export async function addInvoice(_prev: FormState, formData: FormData): Promise<FormState> {
  const client = String(formData.get("client_name") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const due = String(formData.get("due_date") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!client || client.length > 120) return { error: "Enter a client name (max 120 characters)." };
  if (!Number.isFinite(amount) || amount <= 0) return { error: "Amount must be greater than 0." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(due)) return { error: "Pick a valid due date." };
  if (notes.length > 500) return { error: "Notes are limited to 500 characters." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Your session expired. Please log in again." };

  const { error } = await supabase
    .from("invoices")
    .insert({ client_name: client, amount, due_date: due, notes: notes || null });

  if (error) {
    if (error.message.includes("FREE_LIMIT")) {
      return { error: "Free plan limit reached (5 invoices). Upgrade to Pro to add more." };
    }
    return { error: `Could not save the invoice: ${error.message}` };
  }
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function setStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const status = formData.get("status") === "paid" ? "paid" : "pending";
  const supabase = await createClient();
  const { error } = await supabase.from("invoices").update({ status }).eq("id", id);
  if (error) throw new Error(`Could not update invoice: ${error.message}`);
  revalidatePath("/dashboard");
}

export async function deleteInvoice(formData: FormData) {
  const id = String(formData.get("id"));
  const supabase = await createClient();
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) throw new Error(`Could not delete invoice: ${error.message}`);
  revalidatePath("/dashboard");
}

export async function changePlan(formData: FormData) {
  const tier = formData.get("tier") === "pro" ? "pro" : "free";
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_my_tier", { new_tier: tier });
  if (error) throw new Error(`Could not change plan: ${error.message}`);
  revalidatePath("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
