"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { env } from "@/lib/env";

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error?: any) => void;
  onExpire?: () => void;
}

export interface TurnstileWidgetRef {
  reset: () => void;
}

export const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  ({ onVerify, onError, onExpire }, ref) => {
    const { resolvedTheme } = useTheme();
    const turnstileRef = useRef<TurnstileInstance>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        turnstileRef.current?.reset();
      },
    }));

    const siteKey = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

    return (
      <div className="flex justify-start my-2 min-h-[65px]">
        <Turnstile
          ref={turnstileRef}
          siteKey={siteKey}
          injectScript={true}
          options={{
            theme: (resolvedTheme as "light" | "dark") || "auto",
            size: "normal",
          }}
          onSuccess={onVerify}
          onError={onError}
          onExpire={onExpire}
        />
      </div>
    );
  }
);

TurnstileWidget.displayName = "TurnstileWidget";
