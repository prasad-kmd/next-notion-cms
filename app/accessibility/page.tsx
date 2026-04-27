import type { Metadata } from "next";
import { Accessibility, Eye, Keyboard } from "lucide-react";

const title = "Accessibility Statement";
const description =
  "Our commitment to making our engineering platform accessible to everyone, regardless of technology or ability.";

export const metadata: Metadata = {
  title,
  description,
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold mozilla-headline flex items-center gap-3">
            <Accessibility className="h-10 w-10 text-primary" />
            Accessibility Statement
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We are committed to ensuring digital accessibility for people with
            disabilities. We are continually improving the user experience for
            everyone and applying the relevant accessibility standards.
          </p>
        </header>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 google-sans border-b border-border pb-2">
              Conformance Status
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The Web Content Accessibility Guidelines (WCAG) defines
              requirements for designers and developers to improve accessibility
              for people with disabilities. It defines three levels of
              conformance: Level A, Level AA, and Level AAA. This platform is
              partially conformant with WCAG 2.1 level AA.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-2xl bg-card/40 border border-border">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Keyboard className="h-5 w-5" />
              </div>
              <h3 className="font-bold mb-2">Keyboard Navigation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Most interactive elements are navigable using only a keyboard.
                We use standard focus rings to indicate the current position.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card/40 border border-border">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="font-bold mb-2">Visual Clarity</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We aim for high color contrast and clear typography. Text size
                can be adjusted using standard browser zoom tools.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 google-sans border-b border-border pb-2">
              Feedback
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We welcome your feedback on the accessibility of our platform.
              Please let us know if you encounter accessibility barriers:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-4 space-y-2">
              <li>Email: accessibility@example.com</li>
              <li>Twitter: @PrasadM</li>
            </ul>
          </section>

          <section className="bg-muted/30 p-8 rounded-2xl border border-border">
            <h2 className="text-xl font-bold mb-4">Technical Specifications</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Accessibility of this site relies on the following technologies to
              work with the particular combination of web browser and any
              assistive technologies or plugins installed on your computer:
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["HTML", "WAI-ARIA", "CSS", "JavaScript"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-background border border-border text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
