import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";
import bcrypt from "bcryptjs";

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Seeding database...");

  // Admin user
  const email = process.env.ADMIN_EMAIL || "admin@webkit.local";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name: "Admin",
    },
  });
  console.log(`  Admin user: ${email}`);

  // Site settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      businessName: process.env.SITE_NAME || "My Business",
      businessNameAr: "عملي",
      phone: "+1234567890",
      whatsappNumber: process.env.WHATSAPP_NUMBER || "+1234567890",
      email: email,
      address: "123 Business Street, City",
      addressAr: "١٢٣ شارع الأعمال، المدينة",
      metaTitle: process.env.SITE_NAME || "My Business",
      metaTitleAr: "عملي",
      metaDescription: "Your trusted local business providing quality services.",
      metaDescriptionAr: "عملك المحلي الموثوق الذي يقدم خدمات عالية الجودة.",
    },
  });
  console.log("  Site settings created");

  // Sample services
  const services = [
    {
      slug: "consulting",
      title: "Consulting",
      titleAr: "استشارات",
      description: "Professional consulting services tailored to your business needs. We help you develop strategies, optimize operations, and achieve your goals.",
      descriptionAr: "خدمات استشارية مهنية مصممة لتلبية احتياجات عملك. نساعدك في تطوير الاستراتيجيات وتحسين العمليات وتحقيق أهدافك.",
      sortOrder: 0,
    },
    {
      slug: "design",
      title: "Design",
      titleAr: "تصميم",
      description: "Creative design solutions that make your brand stand out. From branding to digital design, we bring your vision to life.",
      descriptionAr: "حلول تصميم إبداعية تجعل علامتك التجارية تبرز. من العلامة التجارية إلى التصميم الرقمي، نحول رؤيتك إلى واقع.",
      sortOrder: 1,
    },
    {
      slug: "development",
      title: "Development",
      titleAr: "تطوير",
      description: "Modern web and application development using the latest technologies. We build fast, reliable, and scalable solutions.",
      descriptionAr: "تطوير مواقع وتطبيقات حديثة باستخدام أحدث التقنيات. نبني حلولاً سريعة وموثوقة وقابلة للتوسع.",
      sortOrder: 2,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }
  console.log(`  ${services.length} sample services created`);

  // Sample contact submissions
  await prisma.contactSubmission.createMany({
    data: [
      {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1987654321",
        message: "I'm interested in your consulting services. Can we schedule a call?",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        message: "Love your work! Do you offer design packages for small businesses?",
        isRead: true,
      },
    ],
    skipDuplicates: true,
  });
  console.log("  2 sample contact submissions created");

  // Sample WhatsApp lead
  await prisma.whatsAppLead.createMany({
    data: [
      {
        name: "Ahmed",
        phone: "+966501234567",
        source: "contact-page",
      },
    ],
    skipDuplicates: true,
  });
  console.log("  1 sample WhatsApp lead created");

  await prisma.$disconnect();
  await pool.end();
  console.log("Seeding complete!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
