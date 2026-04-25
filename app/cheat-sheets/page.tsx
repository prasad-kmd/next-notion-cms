import type { Metadata } from "next";
import {
  Printer,
  Download,
  _Search,
  Layout,
  Cpu,
  Code2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const title = "Engineering Cheat Sheets";
const description =
  "Printable PDF-style reference pages for resistor codes, thread dimensions, Python one-liners, and more.";

export const metadata: Metadata = {
  title,
  description,
};

const cheatsheets = [
  {
    title: "Resistor Color Codes",
    description:
      "Quick reference for 4-band and 5-band resistor identification.",
    icon: Cpu,
    category: "Electronics",
  },
  {
    title: "Metric Thread Dimensions",
    description:
      "Standard ISO metric screw thread dimensions and tap drill sizes.",
    icon: Layers,
    category: "Mechanical",
  },
  {
    title: "Python for Engineers",
    description:
      "One-liners and libraries for data analysis and hardware control.",
    icon: Code2,
    category: "Software",
  },
  {
    title: "PCB Design Rules",
    description:
      "Common clearances, trace widths, and via sizing for standard manufacturing.",
    icon: Layout,
    category: "Electronics",
  },
];

export default function CheatSheetsPage() {
  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold mozilla-headline flex items-center gap-3">
            <Printer className="h-10 w-10 text-primary" />
            Cheat Sheets
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Condensed technical references designed for quick lookup and
            printing. Perfect for taping to your workbench or keeping in your
            CAD notebook.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {cheatsheets.map((sheet) => (
            <Card
              key={sheet.title}
              className="group overflow-hidden border-border bg-card/40 hover:bg-card/60 transition-all hover:border-primary/50"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                  <sheet.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                    {sheet.category}
                  </span>
                  <CardTitle className="text-xl google-sans">
                    {sheet.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                  {sheet.description}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" /> PDF
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Printer className="h-4 w-4" /> Print
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm italic">
            All cheat sheets are updated regularly to reflect the latest
            engineering standards.
          </p>
        </div>
      </div>
    </div>
  );
}
