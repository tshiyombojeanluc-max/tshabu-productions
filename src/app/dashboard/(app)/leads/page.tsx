import { Inbox } from "lucide-react";
import { listLeads } from "@/app/dashboard/_lib/data";
import { PageHeader } from "@/app/dashboard/_components/page-header";
import { EmptyState } from "@/app/dashboard/_components/empty-state";
import { LeadCard } from "@/app/dashboard/_components/lead-card";

export const metadata = { title: "Enquiries" };

export default async function LeadsPage() {
  const leads = await listLeads();

  return (
    <div>
      <PageHeader title="Enquiries" description="Messages submitted through your website's contact form." />

      {leads.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-10 w-10" />}
          title="No enquiries yet"
          description="Messages sent through your contact form will show up here, and you'll get an email for each one."
        />
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}
