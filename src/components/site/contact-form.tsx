"use client";

import { useState, type FormEvent } from "react";
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

const projectTypes = ["Photography", "Videography", "Event Coverage", "Brand Content", "Other"];
const budgets = ["Under R2,500", "R2,500 – R5,000", "R5,000 – R10,000", "R10,000+", "Not sure — advise me"];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [projectType, setProjectType] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    window.setTimeout(() => setStatus("success"), 900);
  };

  if (status === "success") {
    return (
      <div className="border border-tshabu-graphite/30 px-8 py-16 text-center">
        <p className="label-caps mb-4 text-tshabu-graphite">Message sent</p>
        <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Thank you. We&rsquo;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="label-caps">First name</Label>
          <Input id="firstName" name="firstName" required className="rounded-none border-x-0 border-t-0 border-b border-tshabu-graphite/40 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-tshabu-black" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="label-caps">Last name</Label>
          <Input id="lastName" name="lastName" required className="rounded-none border-x-0 border-t-0 border-b border-tshabu-graphite/40 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-tshabu-black" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email" className="label-caps">Email</Label>
          <Input id="email" name="email" type="email" required className="rounded-none border-x-0 border-t-0 border-b border-tshabu-graphite/40 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-tshabu-black" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company" className="label-caps">Company</Label>
          <Input id="company" name="company" className="rounded-none border-x-0 border-t-0 border-b border-tshabu-graphite/40 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-tshabu-black" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="label-caps">Project type</Label>
          <Select name="projectType" value={projectType} onValueChange={(v) => setProjectType(v as string)}>
            <SelectTrigger className="w-full rounded-none border-x-0 border-t-0 border-b border-tshabu-graphite/40 bg-transparent px-0">
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
          <Label className="label-caps">Budget</Label>
          <Select name="budget" value={budget} onValueChange={(v) => setBudget(v as string)}>
            <SelectTrigger className="w-full rounded-none border-x-0 border-t-0 border-b border-tshabu-graphite/40 bg-transparent px-0">
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
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          className="rounded-none border-x-0 border-t-0 border-b border-tshabu-graphite/40 bg-transparent px-0 focus-visible:ring-0 focus-visible:border-tshabu-black"
        />
      </div>

      <Button
        type="submit"
        disabled={status === "submitting"}
        className="h-auto rounded-none bg-tshabu-black px-8 py-4 text-sm uppercase tracking-[0.2em] text-tshabu-paper hover:bg-tshabu-charcoal"
      >
        {status === "submitting" ? "Sending…" : "Book Your Session →"}
      </Button>
    </form>
  );
}
