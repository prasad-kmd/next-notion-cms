"use client";

import React, { useEffect, useRef } from "react";
import { useAccessibility, AVAILABLE_FONTS } from "@/contexts/AccessibilityContext";
import { X, RotateCcw, Type, AlignLeft, List, LetterText, Contrast } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { posthog } from "@/lib/posthog-client";

export function ControlPanel() {
  const {
    isPanelOpen,
    updateSetting,
    resetAllSettings,
    fontSize,
    fontFamily,
    lineHeight,
    wordSpacing,
    letterSpacing,
    isHighContrast,
    buttonPosition,
  } = useAccessibility();

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        updateSetting("isPanelOpen", false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        updateSetting("isPanelOpen", false);
      }
    };

    if (isPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isPanelOpen, updateSetting]);

  if (!isPanelOpen) return null;

  const trackEvent = (setting: string, value: any) => {
    posthog.capture("accessibility_setting_changed", {
      setting,
      value,
    });
  };

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 150,
  };

  if (buttonPosition) {
    // Try to position panel near the button
    const isLeft = buttonPosition.x < window.innerWidth / 2;
    const isTop = buttonPosition.y < window.innerHeight / 2;

    if (isLeft) {
      panelStyle.left = buttonPosition.x + 60;
    } else {
      panelStyle.right = window.innerWidth - buttonPosition.x + 10;
    }

    if (isTop) {
      panelStyle.top = buttonPosition.y;
    } else {
      panelStyle.bottom = window.innerHeight - buttonPosition.y - 40;
    }
  } else {
    panelStyle.bottom = '80px';
    panelStyle.right = '20px';
  }

  return (
    <Card
      ref={panelRef}
      style={panelStyle}
      className="w-80 shadow-2xl border-primary/20 backdrop-blur-xl bg-background/95 animate-in fade-in zoom-in duration-200 z-[101]"
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-bold font-mono uppercase tracking-wider flex items-center gap-2">
          <Type className="h-4 w-4" />
          Accessibility
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => {
              resetAllSettings();
              trackEvent("all", "reset");
            }}
            title="Reset all settings"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => updateSetting("isPanelOpen", false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {/* Font Family */}
        <div className="space-y-3">
          <Label className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-2">
            <Type className="h-3 w-3" />
            Font Style
          </Label>
          <Select
            value={fontFamily}
            onValueChange={(value) => {
              updateSetting("fontFamily", value);
              trackEvent("fontFamily", value);
            }}
          >
            <SelectTrigger className="font-mono text-xs">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_FONTS.map((font) => (
                <SelectItem key={font.name} value={font.name} className="font-mono text-xs">
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Text Size */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-2">
              <Type className="h-3 w-3" />
              Text Size
            </Label>
            <span className="text-xs font-mono font-bold">{Math.round(fontSize * 100)}%</span>
          </div>
          <Slider
            value={[fontSize]}
            min={0.8}
            max={1.5}
            step={0.05}
            onValueChange={([val]) => {
              updateSetting("fontSize", val);
            }}
            onValueCommit={([val]) => trackEvent("fontSize", val)}
          />
        </div>

        {/* Line Height */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-2">
              <AlignLeft className="h-3 w-3" />
              Line Spacing
            </Label>
            <span className="text-xs font-mono font-bold">{lineHeight.toFixed(1)}</span>
          </div>
          <Slider
            value={[lineHeight]}
            min={1.0}
            max={2.0}
            step={0.1}
            onValueChange={([val]) => {
              updateSetting("lineHeight", val);
            }}
            onValueCommit={([val]) => trackEvent("lineHeight", val)}
          />
        </div>

        {/* Word Spacing */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-2">
              <List className="h-3 w-3" />
              Word Spacing
            </Label>
            <span className="text-xs font-mono font-bold">{wordSpacing.toFixed(2)}</span>
          </div>
          <Slider
            value={[wordSpacing]}
            min={0.8}
            max={1.5}
            step={0.05}
            onValueChange={([val]) => {
              updateSetting("wordSpacing", val);
            }}
            onValueCommit={([val]) => trackEvent("wordSpacing", val)}
          />
        </div>

        {/* Letter Spacing */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-2">
              <LetterText className="h-3 w-3" />
              Letter Spacing
            </Label>
            <span className="text-xs font-mono font-bold">{letterSpacing.toFixed(2)}</span>
          </div>
          <Slider
            value={[letterSpacing]}
            min={0.8}
            max={1.5}
            step={0.05}
            onValueChange={([val]) => {
              updateSetting("letterSpacing", val);
            }}
            onValueCommit={([val]) => trackEvent("letterSpacing", val)}
          />
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <Label className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-2">
            <Contrast className="h-3 w-3" />
            High Contrast
          </Label>
          <Switch
            checked={isHighContrast}
            onCheckedChange={(checked) => {
              updateSetting("isHighContrast", checked);
              trackEvent("isHighContrast", checked);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
