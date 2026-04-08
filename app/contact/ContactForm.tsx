"use client";

import { useState, useRef } from "react";
import { Send, Loader2, Paperclip, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: ContactFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
    };

    try {
      // Fetch secrets
      const secretsResponse = await fetch("/api/secrets");
      const { telegram_token, telegram_chat_id } = await secretsResponse.json();

      if (!telegram_token || !telegram_chat_id) {
        throw new Error("Telegram configuration is missing.");
      }

      // Prepare message text
      const caption = `
<b>New Contact Form Submission</b>
<b>Name:</b> ${data.name}
<b>Email:</b> ${data.email}
<b>Phone:</b> ${data.phone || "N/A"}
<b>Message:</b>
${data.message}
      `.trim();

      let response;
      if (file) {
        // Use sendDocument if file is attached
        const tgFormData = new FormData();
        tgFormData.append("chat_id", telegram_chat_id);
        tgFormData.append("document", file);
        tgFormData.append("caption", caption);
        tgFormData.append("parse_mode", "HTML");

        response = await fetch(
          `https://api.telegram.org/bot${telegram_token}/sendDocument`,
          {
            method: "POST",
            body: tgFormData,
          },
        );
      } else {
        // Use sendMessage if no file
        response = await fetch(
          `https://api.telegram.org/bot${telegram_token}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: telegram_chat_id,
              text: caption,
              parse_mode: "HTML",
            }),
          },
        );
      }

      const result = await response.json();

      if (result.ok) {
        toast.success(`Hey ${data.name}, your message has been sent!`);
        formRef.current?.reset();
        setFile(null);
      } else {
        throw new Error(result.description || "Failed to send message.");
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(`Failed to send message: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
                isLoading && "opacity-50 pointer-events-none",
              )}
            >
              <Paperclip className="mb-2 h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading}
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
                disabled={isLoading}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="relative h-12 w-full overflow-hidden bg-primary font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-primary/20 active:scale-[0.98]"
          disabled={isLoading}
        >
          {isLoading ? (
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
