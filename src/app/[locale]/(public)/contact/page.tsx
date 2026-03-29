import { ContactForm } from "@/components/public/contact-form";
import { WhatsAppForm } from "@/components/public/whatsapp-form";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Send a Message</h2>
          <ContactForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">WhatsApp</h2>
          <p className="text-muted-foreground mb-4">
            Enter your phone number and we&apos;ll connect you on WhatsApp.
          </p>
          <WhatsAppForm source="contact-page" />
        </div>
      </div>
    </div>
  );
}
