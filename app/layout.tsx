import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";
import "katex/dist/katex.min.css"; // Added KaTeX CSS
import { SidebarProvider } from "@/components/sidebar-context";
import { Navigation } from "@/components/navigation";
import { FloatingNavbar } from "@/components/floating-navbar";
import { Footer } from "@/components/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/scroll-to-top";
import { CustomContextMenu } from "@/components/custom-context-menu";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Engineering Blogfolio",
    template: "%s | Engineering Blogfolio",
  },
  description: "A modern engineering blogfolio + workspace website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SidebarProvider>
              <div className="flex relative">
                <Navigation />
                <div className="flex-1 min-h-screen flex flex-col transition-all duration-300 ease-in-out lg:ml-60 in-[.sidebar-collapsed]:lg:ml-20">
                  <FloatingNavbar />
                  <main className="flex-1 w-full">{children}</main>
                  <Footer />
                  <ScrollToTop />
                </div>
              </div>
              <CustomContextMenu />
              <Toaster position="bottom-right" />
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
