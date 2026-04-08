import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { AIContentIndicator } from "@/components/ai-content-indicator";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Legal disclaimer for the engineering documentation platform.",
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative border-b border-border h-[40vh] min-h-[300px]">
        <Image src="/img/page/diary.webp" alt="Disclaimer" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl amoriaregular">Disclaimer</h1>
            <p className="mt-4 text-lg text-gray-200">
              Legal information and limitations regarding the content on this platform.
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
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
          </div>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 philosopher">General Information</h2>
            <p>
              The information provided on this engineering documentation platform is for general informational and educational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 philosopher">Professional Disclaimer</h2>
            <p>
              The site cannot and does not contain engineering advice. The engineering information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of engineering advice. THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THIS SITE IS SOLELY AT YOUR OWN RISK.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 philosopher">External Links Disclaimer</h2>
            <p>
              The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 philosopher">Errors and Omissions Disclaimer</h2>
            <p>
              While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, we are not responsible for any errors or omissions, or for the results obtained from the use of this information.
            </p>
          </section>
        </div>
      </div>
      <AIContentIndicator />
    </div>
  )
}
