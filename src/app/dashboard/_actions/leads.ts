"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/supabase/types";

async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dashboard/login");
  return supabase;
}

export async function setLeadStatus(id: string, status: Lead["status"]): Promise<{ error: string } | void> {
  const supabase = await getAuthedClient();

  const { data, error } = await supabase.from("leads").update({ status }).eq("id", id).select("id");
  if (error) return { error: "Could not update the enquiry." };
  if (!data || data.length === 0) return { error: "Enquiry not found." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/leads");
}

export async function deleteLead(id: string): Promise<{ error: string } | void> {
  const supabase = await getAuthedClient();

  const { data, error } = await supabase.from("leads").delete().eq("id", id).select("id");
  if (error || !data || data.length === 0) return { error: "Could not delete the enquiry." };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/leads");
}
