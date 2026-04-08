import { Container } from "@/components/container"
import { FadeIn } from "@/components/fade-in"
import { Mail, MessageSquare, Twitter, Github, Linkedin, ArrowRight, MapPin, Phone } from "lucide-react"
import { ContactForm } from "./ContactForm"

export const metadata = {
  title: "Contact",
  description: "Get in touch with me for collaborations, inquiries, or just to say hi.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] border-b border-border overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?q=80&w=2020&auto=format&fit=crop" 
          alt="Contact Us" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 h-full flex items-center justify-center text-center">
          <FadeIn direction="down" className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl mozilla-headline mb-6">
              GET IN TOUCH
            </h1>
            <p className="text-lg leading-relaxed text-gray-200 google-sans font-medium">
              Have questions about my work? Want to collaborate or provide feedback? I&apos;d love to hear from you.
            </p>
          </FadeIn>
        </div>
      </section>

      <Container className="mt-20">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Contact Information */}
          <FadeIn direction="right" className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mozilla-headline mb-6">CONTACT INFORMATION</h2>
              <p className="text-muted-foreground google-sans font-medium leading-relaxed">
                Reach out to me through any of the following channels. I typically respond within 24-48 hours.
              </p>
              
              <div className="mt-10 space-y-6">
                {[
                  { icon: Mail, label: "Email", value: "prasad.kmd@gmail.com", sub: "Direct inquiry" },
                  { icon: Phone, label: "Phone", value: "+94 11 234 5678", sub: "Mon-Fri, 9AM-5PM" },
                  { icon: MapPin, label: "Location", value: "Colombo, Sri Lanka", sub: "Faculty of Engineering" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 rounded-2xl border border-border bg-card/30 hover:border-primary/50 transition-all group">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground google-sans">{item.label}</h3>
                      <p className="text-sm text-primary font-bold google-sans mt-0.5">{item.value}</p>
                      <p className="text-xs text-muted-foreground google-sans mt-1">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-12 border-t border-border/50">
                <h3 className="text-xl font-bold google-sans mb-6">Connect on Social</h3>
                <div className="flex gap-4">
                  {[Github, Twitter, Linkedin].map((Icon, i) => (
                    <button key={i} className="h-12 w-12 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
                      <Icon size={20} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Contact Form */}
          <FadeIn direction="left">
            <div className="rounded-[2.5rem] border border-border bg-card/50 p-8 md:p-12 shadow-2xl relative overflow-hidden glass-card">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MessageSquare size={120} className="text-primary" />
              </div>
              <div className="relative z-10">
                <h2 className="mb-8 text-3xl font-bold mozilla-headline">SEND A MESSAGE</h2>
                <ContactForm />
              </div>
            </div>
          </FadeIn>
        </div>

        {/* FAQ Section */}
        <FadeIn direction="up" className="mt-32">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold mozilla-headline text-center mb-12">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="space-y-4">
              {[
                { q: "Can I collaborate with you?", a: "I welcome collaboration opportunities! Please reach out via email with details about your background and how you'd like to work together." },
                { q: "Are you looking for professional opportunities?", a: "Yes! I'm interested in connecting with industry partners and exploring professional opportunities where I can apply my engineering skills." },
                { q: "How can I stay updated on your work?", a: "Check my Blog and Projects sections regularly for updates. You can also follow me on LinkedIn for major professional updates." },
              ].map((faq, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card/30 p-8 hover:bg-card/50 transition-colors">
                  <h3 className="font-bold text-lg google-sans mb-3">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed google-sans font-medium">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}
