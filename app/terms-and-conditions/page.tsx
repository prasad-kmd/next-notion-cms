import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Scale, ArrowLeft } from "lucide-react"
import { AIContentIndicator } from "@/components/ai-content-indicator";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for the engineering documentation platform.",
}

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative border-b border-border h-[40vh] min-h-[300px]">
        <Image src="/img/page/ideas.webp" alt="Terms and Conditions" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl amoriaregular">Terms and Conditions</h1>
            <p className="mt-4 text-lg text-gray-200">
              The rules, guidelines, and agreements for using our platform.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <Link 
          href="/pages" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Directory
        </Link>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <p className="text-sm m-0 italic text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            <Scale className="h-6 w-6 text-blue-500" />
          </div>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 philosopher">Acknowledgment</h2>
            <p>
              These are the Terms and Conditions governing the use of this service and the agreement that operates between you and the company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the service.
            </p>
            <p>
              Your access to and use of the service is conditioned on your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 philosopher">Intellectual Property</h2>
            <p>
              The service and its original content (excluding content provided by you or other users), features and functionality are and will remain the exclusive property of the company and its licensors.
            </p>
            <p>
              Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of the company.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 philosopher">Limitation of Liability</h2>
            <p>
              In no event shall the company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury) arising out of or in any way related to the use of or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 philosopher">Governing Law</h2>
            <p>
              The laws of the country, excluding its conflicts of law rules, shall govern this terms and your use of the service. Your use of the application may also be subject to other local, state, national, or international laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 philosopher">Changes to These Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will make reasonable efforts to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>
        </div>
      </div>
      <AIContentIndicator />
    </div>
  )
}
