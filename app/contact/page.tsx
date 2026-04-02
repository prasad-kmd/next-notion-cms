import { Container } from "@/components/container"
import { FadeIn } from "@/components/fade-in"
import { Mail, MessageSquare, Twitter, Github, Linkedin, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Contact",
  description: "Get in touch with me for collaborations, inquiries, or just to say hi.",
}

export default function ContactPage() {
  return (
    <div className="py-20">
      <Container>
        <FadeIn>
          <div className="max-w-4xl space-y-12">
            <section className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
                Get in Touch
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Have a question, a project idea, or just want to connect?
                I'm always open to discussing new opportunities and collaborations.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <a
                href="mailto:contact@example.com"
                className="group flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all hover:translate-y-[-4px]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Email</h3>
                  <p className="text-sm text-muted-foreground">contact@example.com</p>
                </div>
                <div className="mt-auto flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                   Send an email <ArrowRight size={14} />
                </div>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all hover:translate-y-[-4px]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Twitter className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Twitter</h3>
                  <p className="text-sm text-muted-foreground">@example_handle</p>
                </div>
                <div className="mt-auto flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                   Follow me <ArrowRight size={14} />
                </div>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all hover:translate-y-[-4px]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Linkedin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">LinkedIn</h3>
                  <p className="text-sm text-muted-foreground">Professional Profile</p>
                </div>
                <div className="mt-auto flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                   Connect <ArrowRight size={14} />
                </div>
              </a>
            </div>

            <section className="p-8 md:p-12 rounded-3xl bg-card border border-border/50 space-y-8">
              <div className="flex items-center gap-4">
                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary animate-pulse">
                   <MessageSquare className="h-6 w-6" />
                 </div>
                 <h2 className="text-2xl md:text-3xl font-bold">Quick Contact</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                   <label className="block text-sm font-medium text-muted-foreground">Name</label>
                   <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                   />
                 </div>
                 <div className="space-y-4">
                   <label className="block text-sm font-medium text-muted-foreground">Email</label>
                   <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                   />
                 </div>
                 <div className="md:col-span-2 space-y-4">
                   <label className="block text-sm font-medium text-muted-foreground">Message</label>
                   <textarea
                    rows={4}
                    placeholder="How can I help you?"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none"
                   ></textarea>
                 </div>
                 <div className="md:col-span-2">
                   <button className="w-full md:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-[1.02] active:scale-95 transition-all">
                     Send Message
                   </button>
                 </div>
              </div>
            </section>
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}
