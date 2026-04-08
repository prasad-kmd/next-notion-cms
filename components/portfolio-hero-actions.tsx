"use client";

import { Mail, FileDown, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { siteConfig } from "@/lib/config";
import Link from "next/link";

export function PortfolioHeroActions() {
  const handleDownloadCV = () => {
    toast.info("CV download will be available soon!");
  };

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
      <Button className="rounded-full px-8" asChild>
        <Link href={siteConfig.socialLinks.email}>
          <Mail className="mr-2 h-4 w-4" />
          Contact Me
        </Link>
      </Button>
      <Button
        variant="outline"
        className="rounded-full px-8 border-primary/20 hover:bg-primary/10"
        onClick={handleDownloadCV}
      >
        <FileDown className="mr-2 h-4 w-4" />
        Download CV
      </Button>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full transition-colors hover:bg-primary/10 hover:text-primary"
          asChild
        >
          <Link
            href={siteConfig.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-5 w-5" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full transition-colors hover:bg-primary/10 hover:text-primary"
          asChild
        >
          <Link
            href={siteConfig.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
