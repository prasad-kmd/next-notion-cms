import type { Metadata } from "next";
import { ShieldAlert, Lock, Bug, Mail, FileCheck } from "lucide-react";

const title = "Security Policy";
const description =
  "Information on how to report vulnerabilities and our commitment to the security of our tools and site.";

export const metadata: Metadata = {
  title,
  description,
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold font-serif flex items-center gap-3">
            <ShieldAlert className="h-10 w-10 text-primary" />
            Security Policy
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We take the security of our engineering tools and platform
            seriously. If you believe you have found a security vulnerability,
            we appreciate your help in disclosing it to us in a responsible
            manner.
          </p>
        </header>

        <div className="space-y-12">
          <section className="bg-card/40 border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 font-sans flex items-center gap-2">
              <Bug className="h-6 w-6 text-primary" />
              Reporting a Vulnerability
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Please do not use GitHub issues for reporting security
              vulnerabilities. Instead, please send an email to:
            </p>
            <div className="bg-muted/50 p-4 rounded-xl border border-border flex items-center gap-3 w-fit mb-6">
              <Mail className="h-5 w-5 text-primary" />
              <code className="text-sm font-bold">security@example.com</code>
            </div>
            <p className="text-sm text-muted-foreground italic">
              Please include a detailed description of the vulnerability and
              steps to reproduce it. We will acknowledge receipt of your report
              within 48 hours.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-2xl bg-card/40 border border-border">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-bold mb-2">Our Responsibility</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We commit to addressing verified vulnerabilities promptly and
                keeping you informed of our progress.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card/40 border border-border">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <FileCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold mb-2">Safe Harbor</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We will not pursue legal action against researchers who provide
                reasonable time to respond to a report and follow this policy.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
