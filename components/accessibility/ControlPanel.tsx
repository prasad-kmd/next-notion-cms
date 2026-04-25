"use client";

import React from "react";
import { useAccessibility, AVAILABLE_FONTS } from "@/contexts/AccessibilityContext";
import { X, RotateCcw, Type, AlignLeft, List, LetterText, Contrast, Accessibility as AccessibilityIcon } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  } = useAccessibility();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trackEvent = (setting: string, value: any) => {
    posthog.capture("accessibility_setting_changed", {
      setting,
      value,
    });
  };

  return (
    <Dialog open={isPanelOpen} onOpenChange={(open) => updateSetting("isPanelOpen", open)}>
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-background/95 border-primary/20 shadow-2xl overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-border pb-4 mb-4">
          <DialogTitle className="text-lg font-bold font-mono uppercase tracking-widest flex items-center gap-3">
            <AccessibilityIcon className="h-5 w-5 text-primary" />
            Reading Experience
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={() => {
              resetAllSettings();
              trackEvent("all", "reset");
            }}
            title="Reset all settings"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-8 py-2">
          {/* Font Family */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
              <Type className="h-3 w-3" />
              Typography Style
            </Label>
            <Select
              value={fontFamily}
              onValueChange={(value) => {
                updateSetting("fontFamily", value);
                trackEvent("fontFamily", value);
              }}
            >
              <SelectTrigger className="font-mono text-xs border-primary/10 bg-muted/30">
                <SelectValue placeholder="Select font style" />
              </SelectTrigger>
              <SelectContent className="z-[300]">
                {AVAILABLE_FONTS.map((font) => (
                  <SelectItem key={font.name} value={font.name} className="font-mono text-xs">
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
            {/* Text Size */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                  <Type className="h-3 w-3" />
                  Text Size
                </Label>
                <span className="text-[10px] font-black font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">{Math.round(fontSize * 100)}%</span>
              </div>
              <Slider
                value={[fontSize]}
                min={0.8}
                max={1.5}
                step={0.05}
                onValueChange={([val]) => updateSetting("fontSize", val)}
                onValueCommit={([val]) => trackEvent("fontSize", val)}
              />
            </div>

            {/* Line Height */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                  <AlignLeft className="h-3 w-3" />
                  Line Spacing
                </Label>
                <span className="text-[10px] font-black font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">{lineHeight.toFixed(1)}</span>
              </div>
              <Slider
                value={[lineHeight]}
                min={1.0}
                max={2.0}
                step={0.1}
                onValueChange={([val]) => updateSetting("lineHeight", val)}
                onValueCommit={([val]) => trackEvent("lineHeight", val)}
              />
            </div>

            {/* Word Spacing */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                  <List className="h-3 w-3" />
                  Word Spacing
                </Label>
                <span className="text-[10px] font-black font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">{wordSpacing.toFixed(2)}</span>
              </div>
              <Slider
                value={[wordSpacing]}
                min={0.8}
                max={1.5}
                step={0.05}
                onValueChange={([val]) => updateSetting("wordSpacing", val)}
                onValueCommit={([val]) => trackEvent("wordSpacing", val)}
              />
            </div>

            {/* Letter Spacing */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                  <LetterText className="h-3 w-3" />
                  Letter Spacing
                </Label>
                <span className="text-[10px] font-black font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">{letterSpacing.toFixed(2)}</span>
              </div>
              <Slider
                value={[letterSpacing]}
                min={0.8}
                max={1.5}
                step={0.05}
                onValueChange={([val]) => updateSetting("letterSpacing", val)}
                onValueCommit={([val]) => trackEvent("letterSpacing", val)}
              />
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between pt-6 border-t border-border/50">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                <Contrast className="h-3 w-3" />
                High Contrast Content
              </Label>
              <p className="text-[9px] text-muted-foreground font-mono">Maximize text-to-background contrast</p>
            </div>
            <Switch
              checked={isHighContrast}
              onCheckedChange={(checked) => {
                updateSetting("isHighContrast", checked);
                trackEvent("isHighContrast", checked);
              }}
            />
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border flex justify-end">
           <Button 
            className="font-mono text-[10px] font-black uppercase tracking-widest px-8 rounded-xl"
            onClick={() => updateSetting("isPanelOpen", false)}
          >
            Apply & Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
