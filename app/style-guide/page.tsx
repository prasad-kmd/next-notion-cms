import type { Metadata } from "next";
import { Palette, Type, Layout, Image as ImageIcon, Copy } from "lucide-react";

const title = "Style Guide";
const description =
  "Visual brand assets, color palette, and typography guidelines for the engineering platform.";

export const metadata: Metadata = {
  title,
  description,
};

const colors = [
  { name: "Primary", hex: "#3b82f6", variable: "--primary" },
  { name: "Secondary", hex: "#10b981", variable: "--secondary" },
  { name: "Background", hex: "#030712", variable: "--background" },
  { name: "Foreground", hex: "#f8fafc", variable: "--foreground" },
  { name: "Muted", hex: "#1e293b", variable: "--muted" },
  { name: "Accent", hex: "#8b5cf6", variable: "--accent" },
];

const fonts = [
  {
    name: "Mozilla Headline",
    usage: "Page Headers & Branding",
    sample: "The quick brown fox",
  },
  {
    name: "Google Sans",
    usage: "Main Navigation & Buttons",
    sample: "The quick brown fox",
  },
  {
    name: "Inter",
    usage: "Body Content & Documentation",
    sample: "The quick brown fox",
  },
  {
    name: "JetBrains Mono",
    usage: "Code Snippets & Technical Data",
    sample: "const x = 42;",
  },
];

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold mozilla-headline flex items-center gap-3">
            <Palette className="h-10 w-10 text-primary" />
            Style Guide
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            A comprehensive guide to our visual identity. These assets and
            guidelines ensure consistency across our tools, documentation, and
            external collaborations.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 google-sans flex items-center gap-2">
            <Layout className="h-6 w-6 text-primary" />
            Color Palette
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {colors.map((color) => (
              <div
                key={color.name}
                className="group rounded-2xl border border-border bg-card overflow-hidden"
              >
                <div
                  className="h-24 w-full"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm">{color.name}</h3>
                    <code className="text-xs text-muted-foreground">
                      {color.hex}
                    </code>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 google-sans flex items-center gap-2">
            <Type className="h-6 w-6 text-primary" />
            Typography
          </h2>
          <div className="space-y-6">
            {fonts.map((font) => (
              <div
                key={font.name}
                className="p-6 rounded-2xl border border-border bg-card/40"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{font.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">
                      {font.usage}
                    </p>
                  </div>
                </div>
                <p
                  className="text-3xl border-t border-border pt-4 mt-2"
                  style={{
                    fontFamily:
                      font.name === "Mozilla Headline"
                        ? "var(--font-mozilla-headline)"
                        : font.name === "JetBrains Mono"
                          ? "var(--font-jetbrains-mono)"
                          : "inherit",
                  }}
                >
                  {font.sample}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-8 google-sans flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            Brand Assets
          </h2>
          <div className="p-12 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center bg-card/20">
            <div className="h-20 w-20 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground text-4xl font-bold mb-6">
              PM
            </div>
            <h3 className="text-xl font-bold mb-2">Logo Package</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Download high-resolution logos in PNG, SVG, and EPS formats for
              various backgrounds.
            </p>
            <button className="px-6 py-2 rounded-xl bg-card border border-border text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-all">
              Download Assets (.zip)
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
