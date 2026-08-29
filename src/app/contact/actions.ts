"use server";

import { createClient } from "@/lib/supabase/server";
import { sendLeadNotification } from "@/lib/email";

export type ContactFormState = { error: string } | { success: true } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactForm(_prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const projectType = String(formData.get("projectType") ?? "").trim();
  const budget = String(formData.get("budget") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!firstName || !lastName || !email || !message) {
    return { error: "Please fill in your name, email and a short message." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "That email address doesn't look right — please check it and try again." };
  }
  if (message.length > 5000) {
    return { error: "That message is a bit long — please keep it under 5000 characters." };
  }

  const leadFields = {
    first_name: firstName,
    last_name: lastName,
    email,
    company: company || null,
    project_type: projectType || null,
    budget: budget || null,
    message,
  };

  const supabase = await createClient();
  // No .select() here on purpose: RLS correctly never lets an anonymous
  // visitor read leads back (INSERT ... RETURNING needs SELECT-policy
  // visibility too), so asking for the row would fail RLS even though the
  // insert itself succeeds. The plain insert result tells us success/failure.
  const { error: insertError } = await supabase.from("leads").insert(leadFields);

  if (insertError) {
    console.error("Lead insert failed:", insertError);
    return { error: "Something went wrong sending your message. Please try again or email us directly." };
  }

  // The enquiry is safely captured either way — a failed notification email
  // just means it's picked up from the dashboard instead of an inbox alert.
  const { sent, error: emailError } = await sendLeadNotification(leadFields);
  if (!sent) {
    console.error("Lead notification email failed:", emailError);
  }

  return { success: true };
}
