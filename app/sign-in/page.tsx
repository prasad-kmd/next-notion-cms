import { SignInButtons } from "@/components/auth/auth-buttons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Sign In</CardTitle>
                    <CardDescription>
                        Sign in to sync your bookmarks and preferences across devices.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 py-6">
                    <SignInButtons />
                    <p className="text-xs text-muted-foreground text-center mt-4">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
