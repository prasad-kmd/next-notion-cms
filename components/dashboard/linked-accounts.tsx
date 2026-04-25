"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    AlertCircle,
    Loader2,
    Trash2,
} from "lucide-react";
import { 
    SiGoogle, 
    SiGithub, 
    SiFacebook, 
    SiX, 
    SiReddit, 
    SiNotion, 
    SiVercel 
} from "react-icons/si";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Account {
    id: string;
    providerId: string;
    accountId: string;
}

interface LinkedAccountsProps {
    accounts: Account[];
}

const PROVIDERS = [
    { id: "google", name: "Google", icon: SiGoogle, color: "hover:bg-blue-500/10 hover:text-blue-500" },
    { id: "github", name: "GitHub", icon: SiGithub, color: "hover:bg-zinc-500/10 hover:text-zinc-500" },
    { id: "facebook", name: "Facebook", icon: SiFacebook, color: "hover:bg-blue-600/10 hover:text-blue-600" },
    { id: "twitter", name: "Twitter", icon: SiX, color: "hover:bg-zinc-500/10 hover:text-zinc-500" },
    { id: "reddit", name: "Reddit", icon: SiReddit, color: "hover:bg-orange-500/10 hover:text-orange-500" },
    { id: "notion", name: "Notion", icon: SiNotion, color: "hover:bg-zinc-800/10 hover:text-zinc-800" },
    { id: "vercel", name: "Vercel", icon: SiVercel, color: "hover:bg-zinc-900/10 hover:text-zinc-900" },
];

export function LinkedAccounts({ accounts }: LinkedAccountsProps) {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [isUnlinking, setIsUnlinking] = useState<string | null>(null);
    const [confirmUnlink, setConfirmUnlink] = useState<string | null>(null);

    const handleLink = async (providerId: string) => {
        setIsLoading(providerId);
        try {
            await authClient.linkSocial({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                provider: providerId as any,
                callbackURL: window.location.origin + "/dashboard",
            });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message || `Failed to link ${providerId}`);
        } finally {
            setIsLoading(null);
        }
    };

    const handleUnlink = async (id: string) => {
        if (accounts.length <= 1) {
            toast.error("You cannot disconnect your last authentication method.");
            return;
        }

        setIsUnlinking(id);
        try {
            await authClient.unlinkAccount({
                accountID: id,
            });
            toast.success("Account disconnected successfully");
            window.location.reload();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message || "Failed to disconnect account");
        } finally {
            setIsUnlinking(null);
            setConfirmUnlink(null);
        }
    };

    return (
        <Card className="border-border/50 bg-card/30 backdrop-blur">
            <CardHeader>
                <CardTitle className="google-sans">Connected Accounts</CardTitle>
                <CardDescription className="font-local-inter">
                    Link your social accounts to sign in with multiple methods.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {PROVIDERS.map((provider) => {
                    const linkedAccount = accounts.find(a => a.providerId === provider.id);
                    const isLinked = !!linkedAccount;

                    return (
                        <div 
                            key={provider.id} 
                            className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50"
                        >
                            <div className="flex items-center gap-3">
                                <provider.icon className="w-5 h-5" />
                                <span className="font-medium font-google-sans">{provider.name}</span>
                            </div>

                            {isLinked ? (
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setConfirmUnlink(linkedAccount.id)}
                                    disabled={!!isUnlinking || accounts.length <= 1}
                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                >
                                    {isUnlinking === linkedAccount.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Disconnect
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleLink(provider.id)}
                                    disabled={!!isLoading}
                                    className={provider.color}
                                >
                                    {isLoading === provider.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        "Connect"
                                    )}
                                </Button>
                            )}
                        </div>
                    );
                })}

                {accounts.length === 1 && (
                    <div className="flex items-start gap-2 p-3 mt-4 text-xs text-amber-500 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <p>
                            You only have one account linked. Connect another provider to enable disconnecting this one.
                        </p>
                    </div>
                )}
            </CardContent>

            <Dialog open={!!confirmUnlink} onOpenChange={() => setConfirmUnlink(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Disconnection</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to disconnect this account? You will no longer be able to use it to sign in.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmUnlink(null)}>Cancel</Button>
                        <Button 
                            variant="destructive" 
                            onClick={() => confirmUnlink && handleUnlink(confirmUnlink)}
                            disabled={!!isUnlinking}
                        >
                            {isUnlinking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Disconnect"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
