import { prisma } from "@/lib/db/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ContactTable,
  WhatsAppTable,
} from "@/components/admin/submissions-table";

export default async function SubmissionsPage() {
  const [contacts, whatsappLeads] = await Promise.all([
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.whatsAppLead.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const unreadCount = contacts.filter((c) => !c.isRead).length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Submissions</h1>
      <Tabs defaultValue="contact">
        <TabsList>
          <TabsTrigger value="contact">
            Contact {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger value="whatsapp">
            WhatsApp ({whatsappLeads.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="contact" className="mt-4">
          <ContactTable submissions={contacts} />
        </TabsContent>
        <TabsContent value="whatsapp" className="mt-4">
          <WhatsAppTable leads={whatsappLeads} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
