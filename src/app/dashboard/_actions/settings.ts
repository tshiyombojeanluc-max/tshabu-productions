"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SettingsState = { error: string } | { success: string } | null;

export async function updateProfile(_prevState: SettingsState, formData: FormData): Promise<SettingsState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dashboard/login");

  const displayName = String(formData.get("display_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!displayName) return { error: "Name is required." };

  const { error: profileError } = await supabase.from("profiles").update({ display_name: displayName }).eq("id", user.id);
  if (profileError) return { error: "Could not save your name. Please try again." };

  if (email && email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email });
    if (emailError) return { error: `Could not update email: ${emailError.message}` };

    revalidatePath("/dashboard/settings");
    return { success: "Saved. Check your new email address for a confirmation link." };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { success: "Changes saved." };
}

export async function updateAvatar(url: string): Promise<{ error: string } | void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dashboard/login");

  const { error } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
  if (error) return { error: "Could not save your profile photo." };

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
}
