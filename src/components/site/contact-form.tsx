"use client";

import { useActionState, useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { site, whatsappUrl } from "@/lib/data";
import { submitContactForm, type ContactFormState } from "@/app/contact/actions";

const projectTypes = [
  "Event — Photo + Video",
  "Event — Photography",
  "Event — Videography",
  "Conference / Corporate",
  "Headshots / Portraits",
  "Celebration (birthday, matric ball, wedding)",
  "Brand Content",
  "Other",
];
const budgets = [
  "Under R2,500",
  "R2,500 – R5,000",
  "R5,000 – R10,000",
  "R10,000 – R25,000",
  "R25,000+",
  "Not sure — advise me",
];

const fieldClass =
  "rounded-none border-x-0 border-t-0 border-b border-tshabu-graphite/40 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-tshabu-black";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactFormState, FormData>(submitContactForm, null);
  const [projectType, setProjectType] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [renderedAt] = useState(() => Date.now());

  const succeeded = Boolean(state && "success" in state);
  useEffect(() => {
    if (succeeded) track("enquiry_submitted", { projectType: projectType ?? "unspecified" });
  }, [succeeded, projectType]);

  if (state && "success" in state) {
    return (
      <div className="border border-tshabu-graphite/30 px-8 py-16 text-center">
        <p className="label-caps mb-4 text-tshabu-graphite">Message sent</p>
        <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Thanks for reaching out — we&rsquo;ll get back to you soon.
        </p>
        <p className="mt-6 text-sm text-tshabu-graphite">
          In a hurry?{" "}
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="underline">
            WhatsApp us
          </a>{" "}
          or email{" "}
          <a href={`mailto:${site.email}`} className="underline">
            {site.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-10">
      {/* Honeypot: invisible to a real visitor, but a generic form-filling
          bot will often populate any field it can find. A filled value
          here silently short-circuits submission server-side. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this field blank</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="renderedAt" value={renderedAt} />

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="label-caps">First name</Label>
          <Input id="firstName" name="firstName" required className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="label-caps">Last name</Label>
          <Input id="lastName" name="lastName" required className={fieldClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email" className="label-caps">Email</Label>
          <Input id="email" name="email" type="email" required className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="label-caps">Phone / WhatsApp</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" className={fieldClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company" className="label-caps">Company / Organisation</Label>
          <Input id="company" name="company" autoComplete="organization" className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventDate" className="label-caps">Event date</Label>
          <Input id="eventDate" name="eventDate" type="date" className={fieldClass} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="venue" className="label-caps">Venue / Area</Label>
        <Input id="venue" name="venue" placeholder="e.g. CTICC, Century City, Stellenbosch" className={fieldClass} />
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-2">
          <Label id="projectType-label" className="label-caps">Project type</Label>
          <Select name="projectType" value={projectType} onValueChange={(v) => setProjectType(v as string)}>
            <SelectTrigger aria-labelledby="projectType-label" className={`w-full ${fieldClass}`}>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {projectTypes.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label id="budget-label" className="label-caps">Budget</Label>
          <Select name="budget" value={budget} onValueChange={(v) => setBudget(v as string)}>
            <SelectTrigger aria-labelledby="budget-label" className={`w-full ${fieldClass}`}>
              <SelectValue placeholder="Select a range" />
            </SelectTrigger>
            <SelectContent>
              {budgets.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="label-caps">Tell us about your project</Label>
        <Textarea id="message" name="message" required rows={5} className={fieldClass} />
      </div>

      {state && "error" in state && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-auto rounded-none bg-tshabu-black px-8 py-4 text-sm uppercase tracking-[0.2em] text-tshabu-paper hover:bg-tshabu-charcoal"
      >
        {pending ? "Sending…" : "Send Enquiry →"}
      </Button>

      <p className="text-sm text-tshabu-graphite">
        Prefer to chat?{" "}
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
          Message us on WhatsApp
        </a>
        .
      </p>
    </form>
  );
}
