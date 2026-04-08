"use client";

import React, { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Message sent successfully!");
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="h-20 w-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-bold google-sans">Message Sent!</h3>
        <p className="text-muted-foreground google-sans max-w-sm">
          Thank you for reaching out. I'll get back to you as soon as possible.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-primary font-bold google-sans hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest google-sans">Name</label>
        <input
          name="name"
          type="text"
          required
          placeholder="Your Name"
          className="w-full px-5 py-4 rounded-2xl bg-background/50 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all google-sans font-medium"
        />
      </div>
      <div className="space-y-4">
        <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest google-sans">Email</label>
        <input
          name="email"
          type="email"
          required
          placeholder="Your Email"
          className="w-full px-5 py-4 rounded-2xl bg-background/50 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all google-sans font-medium"
        />
      </div>
      <div className="md:col-span-2 space-y-4">
        <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest google-sans">Message</label>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="How can I help you?"
          className="w-full px-5 py-4 rounded-2xl bg-background/50 border border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none google-sans font-medium"
        ></textarea>
      </div>
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isLoading}
          className="group w-full md:w-auto px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <Send size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
