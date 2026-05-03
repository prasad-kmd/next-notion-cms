import type { Metadata } from "next";
import { Heart, Coffee, Star, Rocket, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const title = "Sponsor My Work";
const description =
  "Support the development of open-source engineering tools and educational content.";

export const metadata: Metadata = {
  title,
  description,
};

const tiers = [
  {
    name: "Supporter",
    price: "$5",
    description: "Buy me a coffee and fuel my late-night coding sessions.",
    icon: Coffee,
    color: "text-orange-500",
    features: [
      "Sponsor badge on your profile",
      "Early access to new blog posts",
      "My eternal gratitude",
    ],
  },
  {
    name: "Engineer",
    price: "$25",
    description:
      "Support the maintenance of engineering tools and calculators.",
    icon: Star,
    color: "text-yellow-500",
    features: [
      "All Supporter benefits",
      "Your name in the site's Hall of Fame",
      "Priority feature requests",
      "Private Discord/Slack channel access",
    ],
    highlight: true,
  },
  {
    name: "Partner",
    price: "$100",
    description: "Help scale the platform and reach more engineering students.",
    icon: Rocket,
    color: "text-blue-500",
    features: [
      "All Engineer benefits",
      "Logo on the homepage and READMEs",
      "Quarterly 1-on-1 technical consultation",
      "Custom engineering tool development",
    ],
  },
];

import { siteConfig } from "@/lib/config";

export default function SponsorshipPage() {
  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
      <div className="mx-auto max-w-5xl text-center">
        <header className="mb-16">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-primary/10 text-primary">
            <Heart className="h-8 w-8 fill-current" />
          </div>
          <h1 className="mb-4 text-4xl font-bold font-serif lg:text-5xl">
            Sponsor My Work
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            I&apos;m dedicated to building high-quality, open-source tools for
            the engineering community. Your support helps cover hosting costs
            and allows me to dedicate more time to creating free educational
            resources.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative flex flex-col border-border bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 ${tier.highlight ? "ring-2 ring-primary border-primary/50 scale-105 z-10" : ""}`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <div
                  className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${tier.color}`}
                >
                  <tier.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-sans">
                  {tier.name}
                </CardTitle>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-4 min-h-[48px]">
                  {tier.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-left">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full h-11 text-base font-semibold"
                  variant={tier.highlight ? "default" : "outline"}
                  asChild
                >
                  <a
                    href={siteConfig.socialLinks.sponsorship}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sponsor via GitHub
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-20 p-8 rounded-3xl border border-dashed border-border bg-muted/30">
          <h2 className="text-2xl font-bold font-sans mb-4">
            Other Ways to Support
          </h2>
          <p className="text-muted-foreground mb-6">
            Not ready for a monthly commitment? You can also make a one-time
            donation via PayPal or Buy Me a Coffee. Every bit helps!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary">One-time Donation</Button>
            <Button variant="secondary">Crypto Address</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
