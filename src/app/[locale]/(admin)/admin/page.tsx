import { prisma } from "@/lib/db/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, ImageIcon, MessageSquare, Phone } from "lucide-react";

export default async function AdminDashboard() {
  const [serviceCount, galleryCount, contactCount, whatsappCount] =
    await Promise.all([
      prisma.service.count(),
      prisma.galleryImage.count(),
      prisma.contactSubmission.count({ where: { isRead: false } }),
      prisma.whatsAppLead.count(),
    ]);

  const stats = [
    { label: "Services", value: serviceCount, icon: Briefcase },
    { label: "Gallery Images", value: galleryCount, icon: ImageIcon },
    { label: "Unread Messages", value: contactCount, icon: MessageSquare },
    { label: "WhatsApp Leads", value: whatsappCount, icon: Phone },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
