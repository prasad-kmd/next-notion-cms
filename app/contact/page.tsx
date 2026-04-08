import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "@/lib/config";

import ContactForm from "./ContactForm";

const title = "Get In Touch";
const description =
  "Have questions about my work? Want to collaborate or provide feedback? I'd love to hear from you.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/contact",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(title)}`,
        width: 1200,
        height: 630,
        alt: description,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`/api/og?title=${encodeURIComponent(title)}`],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative border-b border-border">
        <Image
          src="/img/contact_us.webp"
          alt="Contact Us"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h1 className="text-4xl font-bold tracking-tight text-balance lg:text-5xl amoriaregular">
              Get In Touch
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-200 text-pretty">
              Have questions about my work? Want to collaborate or provide
              feedback? I&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold">Contact Information</h2>
              <p className="mt-4 text-muted-foreground">
                Reach out to me through any of the following channels. I
                typically respond within 24-48 hours.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {siteConfig.socialLinks.email.replace("mailto:", "")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      +94 11 234 5678
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Available Mon-Fri, 9:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Faculty of Engineering
                    </p>
                    <p className="text-sm text-muted-foreground">
                      University of [Your University]
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Colombo, Sri Lanka
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info or Socials could go here */}
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="mb-6 text-2xl font-bold">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="mt-8 space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold">Can I collaborate with you?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  I welcome collaboration opportunities! Please reach out via
                  email with details about your background and how you&apos;d
                  like to work together.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold">
                  Are you looking for professional opportunities?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Yes! I&apos;m interested in connecting with industry partners
                  and exploring professional opportunities where I can apply my
                  engineering skills.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold">
                  How can I stay updated on your work?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Check my Blog and Projects sections regularly for updates. You
                  can also follow me on LinkedIn for major professional updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
