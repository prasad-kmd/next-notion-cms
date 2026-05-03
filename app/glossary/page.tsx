"use client";

import { useState } from "react";
import { Book, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const terms = [
  {
    term: "Actuator",
    definition:
      "A component of a machine that is responsible for moving and controlling a mechanism or system, for example by opening a valve.",
    category: "Mechatronics",
  },
  {
    term: "Backlash",
    definition:
      "Clearance or lost motion in a mechanism caused by gaps between parts, especially in gears.",
    category: "Mechanical",
  },
  {
    term: "Capacitance",
    definition: "The ability of a system to store an electric charge.",
    category: "Electronics",
  },
  {
    term: "Duty Cycle",
    definition:
      "The percentage of one period in which a signal or system is active.",
    category: "Electronics",
  },
  {
    term: "Encoder",
    definition:
      "A device that converts motion into an electrical signal that can be read by some type of controlling device.",
    category: "Mechatronics",
  },
  {
    term: "Firmware",
    definition: "Permanent software programmed into a read-only memory.",
    category: "Software",
  },
];

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTerms = terms
    .filter(
      (item) =>
        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold font-serif flex items-center gap-3">
            <Book className="h-10 w-10 text-primary" />
            Engineering Glossary
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            Clear, concise definitions for the technical terminology used
            throughout this platform and the broader engineering field.
          </p>
        </header>

        <div className="mb-8 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terms..."
            className="pl-10 h-11 bg-card/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((item) => (
              <div
                key={item.term}
                className="group p-6 rounded-xl border border-border bg-card/30 hover:bg-card/50 transition-all hover:border-primary/30"
              >
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6">
                  <h2 className="text-xl font-bold font-sans group-hover:text-primary transition-colors min-w-[150px]">
                    {item.term}
                  </h2>
                  <div className="flex-1">
                    <p className="text-muted-foreground leading-relaxed italic mb-2">
                      {item.definition}
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <p className="text-muted-foreground">
                No terms found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>

        <div className="mt-20 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Missing a term? Suggestions for the glossary are always welcome via
            the contact page.
          </p>
        </div>
      </div>
    </div>
  );
}
