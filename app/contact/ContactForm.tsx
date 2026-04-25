"use client";

import { useState, useRef, useActionState, useEffect } from "react";
import { Send, Loader2, Paperclip, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { submitContactForm } from "./actions";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, null);
  const [file, setFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      formRef.current?.reset();
      setFile(null);
    } else if (state?.success === false) {
      toast.error(state.message);
      if (state.errors) {
        Object.values(state.errors).flat().forEach((err: unknown) => toast.error(err));
      }
    }
  }, [state]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("File is too large. Maximum size is 20MB.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      className="group relative space-y-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-card/80 to-card/40 p-1 md:p-1.5"
    >
      {/* Decorative background effect */}
      <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20" />

      <div className="relative space-y-6 rounded-[14px] bg-card p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium tracking-tight"
            >
              Your Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              required
              disabled={isPending}
              className="h-11 bg-muted/50 transition-all focus:bg-background focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium tracking-tight"
            >
              Your Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              disabled={isPending}
              className="h-11 bg-muted/50 transition-all focus:bg-background focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone" className="text-sm font-medium tracking-tight">
            Mobile Number{" "}
            <span className="text-muted-foreground font-normal">
              (Optional)
            </span>
          </Label>
          <Input
            id="phone"
            name="phone"
            placeholder="+94 77 123 4567"
            disabled={isPending}
            className="h-11 bg-muted/50 transition-all focus:bg-background focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="message"
            className="text-sm font-medium tracking-tight"
          >
            Your Message
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell me about your project..."
            className="min-h-[120px] resize-none bg-muted/50 transition-all focus:bg-background focus:ring-2 focus:ring-primary/20"
            required
            disabled={isPending}
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium tracking-tight">
            Attachment{" "}
            <span className="text-muted-foreground font-normal">
              (Optional, max 20MB)
            </span>
          </Label>

          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 py-8 transition-all hover:border-primary/40 hover:bg-muted/50",
                isPending && "opacity-50 pointer-events-none",
              )}
            >
              <Paperclip className="mb-2 h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <Input
                ref={fileInputRef}
                name="file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={isPending}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-3 animate-in fade-in slide-in-from-bottom-1">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium line-clamp-1 max-w-[200px] md:max-w-[300px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={removeFile}
                disabled={isPending}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
              {/* Hidden input to keep file in FormData when using form action */}
              <input type="file" name="file" className="hidden" ref={(el) => {
                if (el && file) {
                   const dataTransfer = new DataTransfer();
                   dataTransfer.items.add(file);
                   el.files = dataTransfer.files;
                }
              }} />
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="relative h-12 w-full overflow-hidden bg-primary font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-primary/20 active:scale-[0.98]"
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Sending...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Send className="h-5 w-5" />
              <span>Send Message</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
