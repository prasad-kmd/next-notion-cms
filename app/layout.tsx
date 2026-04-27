import type React from "react";
import type { Metadata } from "next";
// import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "./print.css";
import { Navigation } from "@/components/navigation";
import { SidebarProvider } from "@/components/sidebar-context";
import { ThemeProvider } from "@/components/theme-provider";
import { FloatingNavbar } from "@/components/floating-navbar";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "katex/dist/katex.min.css";

// import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
// import {
//   Inter,
//   JetBrains_Mono,
// } from "next/font/google";

// Initialize fonts

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
// });

// const jetbrainsMono = JetBrains_Mono({
//   subsets: ["latin"],
//   variable: "--font-jetbrains-mono",
// });

const amoriaregular = localFont({
  src: "../public/fonts/en/AMORIARegular.woff2",
  variable: "--font-amoria-regular",
  display: "swap",
});
const mozillaHeadline = localFont({
  src: "../public/fonts/en/MozillaHeadline-Regular.woff2",
  variable: "--font-mozilla-headline",
  display: "swap",
});
const philosopher = localFont({
  src: "../public/fonts/en/Philosopher.woff2",
  variable: "--font-philosopher",
  display: "swap",
});

const googleSans = localFont({
  src: "../public/fonts/GoogleSans-Regular.woff2",
  variable: "--font-google-sans",
  display: "swap",
});

const mozillaText = localFont({
  src: [
    {
      path: "../public/fonts/MozillaText-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/MozillaText-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-mozilla-text",
  display: "swap",
});

const notoSans = localFont({
  src: "../public/fonts/NotoSans-Regular.woff2",
  variable: "--font-noto-sans",
  display: "swap",
});

const notoSansDisplay = localFont({
  src: "../public/fonts/NotoSansDisplay-Regular.woff2",
  variable: "--font-noto-sans-display",
  display: "swap",
});

const notoSerifSinhala = localFont({
  src: "../public/fonts/NotoSerifSinhala-Regular.woff2",
  variable: "--font-noto-serif-sinhala",
  display: "swap",
});

const roboto = localFont({
  src: "../public/fonts/Roboto-Regular.woff2",
  variable: "--font-roboto",
  display: "swap",
});

const spaceMono = localFont({
  src: "../public/fonts/SpaceMono-Regular.woff2",
  variable: "--font-space-mono",
  display: "swap",
});

const localInter = localFont({
  src: "../public/fonts/Inter-Regular.woff2",
  variable: "--font-local-inter",
  display: "swap",
});

const localJetBrainsMono = localFont({
  src: "../public/fonts/JetBrainsMono-Regular.woff2",
  variable: "--font-local-jetbrains-mono",
  display: "swap",
});

import { siteConfig } from "@/lib/config";
import ServiceWorkerRegistrar from "@/components/service-worker-registrar";
import { ConnectivityListener } from "@/components/connectivity-listener";
import { ScrollToTop } from "@/components/scroll-to-top";
import { BookmarksProvider } from "@/hooks/use-bookmarks";
import { CustomContextMenu } from "@/components/custom-context-menu";
import { Footer } from "@/components/footer";
import { ViewTransitions } from "@/components/view-transitions";
import ClickSpark from "@/components/ClickSpark";
import { AccentColorInitializer } from "@/components/accent-color-initializer";
import { AuthInitializer } from "@/components/auth/auth-initializer";
import { PostHogProvider } from "@/components/posthog-provider";
import PostHogPageviewWrapper from "@/components/analytics/PostHogPageview";
// import Script from "next/script";
import { AccessibilityProvider } from "@/providers/AccessibilityProvider";
import { FloatingButton } from "@/components/accessibility/FloatingButton";
import { ControlPanel } from "@/components/accessibility/ControlPanel";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: "%s | Blogfolio",
    default: siteConfig.title,
  },
  description: siteConfig.description,
  generator: siteConfig.author,
  creator: siteConfig.author,
  publisher: siteConfig.author,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: `${siteConfig.author}'s Workspace`,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(siteConfig.title)}`,
        width: 1280,
        height: 720,
        alt: siteConfig.description,
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`/api/og?title=${encodeURIComponent(siteConfig.title)}`],
  },
  icons: {
    icon: [
      { url: "/img/favicon/favicon-32.ico" },
      {
        url: "/img/favicon/favicon-16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/img/favicon/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/img/favicon/favicon-64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        url: "/img/favicon/favicon-128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        url: "/img/favicon/favicon-256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        url: "/img/favicon/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/img/favicon/favicon-16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/img/favicon/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/img/favicon/favicon-64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        url: "/img/favicon/favicon-128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        url: "/img/favicon/favicon-256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        url: "/img/favicon/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: `${siteConfig.author}'s Workspace`,
  },
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${amoriaregular.variable} ${mozillaHeadline.variable} ${philosopher.variable} ${googleSans.variable} ${mozillaText.variable} ${notoSans.variable} ${notoSansDisplay.variable} ${notoSerifSinhala.variable} ${roboto.variable} ${spaceMono.variable} ${localInter.variable} ${localJetBrainsMono.variable}`}
    >
      <body
        className="antialiased selection:bg-brand-200 selection:text-brand-900"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PostHogProvider>
            <AccessibilityProvider>
              <PostHogPageviewWrapper />
              <AccentColorInitializer />
              <AuthInitializer />
              <TooltipProvider>
                <SidebarProvider>
                  <BookmarksProvider>
                    <ViewTransitions>
                      <ClickSpark
                        // sparkColor="#ffffff"
                        sparkSize={10}
                        sparkRadius={15}
                        sparkCount={8}
                        duration={400}
                        easing="linear"
                        extraScale={1.5}
                      >
                        <CustomContextMenu />
                        <FloatingNavbar className="hidden lg:flex" />
                        <Navigation />
                        <main className="transition-[padding] duration-300 lg:pl-(--sidebar-width,256px) overflow-x-clip">
                          {children}
                          <Footer />
                        </main>
                        <FloatingButton />
                        <ControlPanel />
                        <ScrollToTop />
                        <Toaster position="bottom-right" richColors />
                        <ConnectivityListener />
                        {/* <SpeedInsights /> */}
                        <ServiceWorkerRegistrar />
                      </ClickSpark>
                    </ViewTransitions>
                  </BookmarksProvider>
                </SidebarProvider>
              </TooltipProvider>
            </AccessibilityProvider>
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
