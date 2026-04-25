import type { Metadata } from "next";
import {
  Download,
  FileText,
  Box,
  Code,
  FileArchive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
} from "@/components/ui/card";

const title = "Downloads & Resources";
const description =
  "Central repository for CAD files, code examples, datasheets, and engineering schematics.";

export const metadata: Metadata = {
  title,
  description,
};

const resources = [
  {
    category: "CAD Models",
    items: [
      {
        name: "NEMA 17 Stepper Mount",
        format: "STEP, STL",
        size: "1.2 MB",
        icon: Box,
      },
      {
        name: "Universal Sensor Bracket",
        format: "STEP",
        size: "800 KB",
        icon: Box,
      },
    ],
  },
  {
    category: "Code Samples",
    items: [
      {
        name: "I2C Scanner for Arduino",
        format: "INO",
        size: "4 KB",
        icon: Code,
      },
      {
        name: "PID Controller Template",
        format: "CPP, H",
        size: "12 KB",
        icon: Code,
      },
    ],
  },
  {
    category: "Datasheets",
    items: [
      {
        name: "L298N Motor Driver",
        format: "PDF",
        size: "1.5 MB",
        icon: FileText,
      },
      { name: "MPU6050 IMU", format: "PDF", size: "2.1 MB", icon: FileText },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center lg:text-left">
          <h1 className="mb-4 text-4xl font-bold mozilla-headline flex items-center justify-center lg:justify-start gap-3">
            <FileArchive className="h-10 w-10 text-primary" />
            Downloads & Resources
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            A central repository for tangible engineering assets. Access CAD
            files for 3D printing, reusable code modules, and essential
            component datasheets.
          </p>
        </div>

        <div className="space-y-12">
          {resources.map((group) => (
            <section key={group.category}>
              <h2 className="text-2xl font-bold mb-6 google-sans border-l-4 border-primary pl-4">
                {group.category}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.items.map((item) => (
                  <Card
                    key={item.name}
                    className="flex items-center justify-between p-4 border-border bg-card/40 hover:bg-card/60 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{item.name}</h3>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-mono">
                          <span>{item.format}</span>
                          <span>•</span>
                          <span>{item.size}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center gap-6">
          <div className="h-16 w-16 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <FileText className="h-8 w-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold mb-1">
              Looking for something specific?
            </h3>
            <p className="text-sm text-muted-foreground">
              If you need a specific CAD model or code snippet from one of my
              projects that isn't listed here, feel free to reach out.
            </p>
          </div>
          <Button variant="default" className="shrink-0">
            Request Resource
          </Button>
        </div>
      </div>
    </div>
  );
}
