import { SignInButtons } from "@/components/auth/auth-buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TechnicalBackground } from "@/components/technical-background";
import Link from "next/link";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
      <TechnicalBackground />

      <Card className="w-full max-w-md border-border/50 bg-card/30 backdrop-blur-2xl shadow-2xl relative z-10 transition-all duration-500 hover:shadow-primary/5">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-4 transition-transform duration-500 hover:scale-110">
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight google-sans">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground/80 md:text-base">
            Sign in to access your dashboard and sync preferences across all
            your devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 py-8">
          <SignInButtons />

          <div className="w-full h-px bg-linear-to-r from-transparent via-border to-transparent my-2" />

          <p className="text-xs text-muted-foreground/60 text-center max-w-[280px] leading-relaxed">
            By continuing, you agree to our{" "}
            <Link
              href="/terms-and-conditions"
              className="text-primary/80 hover:underline cursor-pointer"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="text-primary/80 hover:underline cursor-pointer"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>

      {/* Subtle floating glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] -z-20 animate-pulse pointer-events-none" />
    </div>
  );
}
