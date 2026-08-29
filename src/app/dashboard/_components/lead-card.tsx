"use client";

import { useState, useTransition } from "react";
import { Check, Copy, Mail, Trash2 } from "lucide-react";
import { setLeadStatus, deleteLead } from "@/app/dashboard/_actions/leads";
import { ConfirmDeleteButton } from "@/app/dashboard/_components/confirm-delete-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { site } from "@/lib/data";
import type { Lead } from "@/lib/supabase/types";

const statusStyles: Record<Lead["status"], string> = {
  new: "bg-tshabu-black text-tshabu-paper",
  read: "bg-tshabu-graphite/15 text-tshabu-graphite",
  archived: "bg-transparent text-tshabu-graphite/50 border border-tshabu-graphite/30",
};

export function LeadCard({ lead }: { lead: Lead }) {
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const fullName = `${lead.first_name} ${lead.last_name}`.trim();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(lead.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked (permissions, insecure context) —
      // the email is still right there in the card text either way.
    }
  };

  const details = [lead.company, lead.project_type, lead.budget].filter(Boolean) as string[];

  return (
    <div className="border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-medium">{fullName}</p>
            <span className={cn("px-2 py-0.5 text-[10px] uppercase tracking-[0.15em]", statusStyles[lead.status])}>
              {lead.status}
            </span>
          </div>
          <a href={`mailto:${lead.email}`} className="text-sm text-tshabu-graphite hover:underline">
            {lead.email}
          </a>
          {details.length > 0 && <p className="mt-1 text-xs text-tshabu-graphite">{details.join(" · ")}</p>}
        </div>
        <p className="label-caps shrink-0">{new Date(lead.created_at).toLocaleDateString()}</p>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{lead.message}</p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <a
          href={`mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent(`Re: your enquiry to ${site.name}`)}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-auto gap-1.5 rounded-none px-3 py-1.5 text-xs")}
        >
          <Mail className="h-3.5 w-3.5" />
          Reply
        </a>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-auto gap-1.5 rounded-none px-3 py-1.5 text-xs"
          onClick={copyEmail}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy Email"}
        </Button>

        {lead.status !== "read" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pending}
            className="h-auto rounded-none px-3 py-1.5 text-xs"
            onClick={() =>
              startTransition(async () => {
                await setLeadStatus(lead.id, "read");
              })
            }
          >
            Mark as read
          </Button>
        )}

        {lead.status !== "archived" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pending}
            className="h-auto rounded-none px-3 py-1.5 text-xs"
            onClick={() =>
              startTransition(async () => {
                await setLeadStatus(lead.id, "archived");
              })
            }
          >
            Archive
          </Button>
        )}

        <ConfirmDeleteButton
          title="Delete this enquiry?"
          description={`This permanently deletes the message from ${fullName}. This can't be undone.`}
          onConfirm={() => deleteLead(lead.id)}
          trigger={
            <Button type="button" variant="ghost" size="sm" className="h-auto gap-1.5 rounded-none px-3 py-1.5 text-xs">
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          }
        />
      </div>
    </div>
  );
}
