import "server-only";

import { Resend } from "resend";
import { site } from "@/lib/data";
import type { Lead } from "@/lib/supabase/types";

// Falls back to Resend's shared sandbox sender so email works out of the
// box before a custom domain is verified in Resend. Once you verify your
// own domain there, set CONTACT_FROM_EMAIL to something like
// "Tshabu Productions <hello@tshabuproductions.com>" for real deliverability.
const FROM_ADDRESS = process.env.CONTACT_FROM_EMAIL || "Tshabu Productions <onboarding@resend.dev>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Best-effort notification email — never throws. The lead is already saved
 * to the database by the time this runs, so a misconfigured or down email
 * provider should never make lead capture itself appear to fail.
 */
export async function sendLeadNotification(lead: Lead): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, error: "RESEND_API_KEY is not configured." };
  }

  const resend = new Resend(apiKey);
  const fullName = `${lead.first_name} ${lead.last_name}`.trim();

  const detailLines = [
    ["Name", fullName],
    ["Email", lead.email],
    lead.company ? ["Company", lead.company] : null,
    lead.project_type ? ["Project type", lead.project_type] : null,
    lead.budget ? ["Budget", lead.budget] : null,
  ].filter((line): line is [string, string] => line !== null);

  const textBody = [
    `New enquiry from ${fullName}`,
    "",
    ...detailLines.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    lead.message,
  ].join("\n");

  const htmlBody = `
    <div style="font-family: -apple-system, sans-serif; color: #111111;">
      <h2 style="margin: 0 0 16px;">New enquiry from ${escapeHtml(fullName)}</h2>
      <table style="border-collapse: collapse; margin-bottom: 16px;">
        ${detailLines
          .map(
            ([label, value]) =>
              `<tr><td style="padding: 2px 12px 2px 0; color: #6f6f6f;">${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`
          )
          .join("")}
      </table>
      <p style="white-space: pre-wrap; border-top: 1px solid #eee; padding-top: 16px;">${escapeHtml(lead.message)}</p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: site.email,
      replyTo: lead.email,
      subject: `New enquiry from ${fullName}`,
      text: textBody,
      html: htmlBody,
    });

    if (error) {
      return { sent: false, error: error.message };
    }
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "Unknown error sending email." };
  }
}
