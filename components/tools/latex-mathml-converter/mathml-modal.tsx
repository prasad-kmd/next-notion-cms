"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Copy } from "lucide-react"
import { toast } from "sonner"

interface MathMLModalProps {
  isOpen: boolean
  onClose: () => void
  mathml: string
}

export default function MathMLModal({ isOpen, onClose, mathml }: MathMLModalProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mathml)
      toast.success("Copied!", {
        description: "MathML code copied to clipboard",
        duration: 2000,
      })
    } catch {
      toast.error("Error", {
        description: "Failed to copy to clipboard",
        duration: 2000,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">MathML Code</DialogTitle>
          <DialogDescription className="text-muted-foreground">Raw MathML markup generated from your LaTeX equation</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg border border-border overflow-auto max-h-96">
            <code className="text-xs font-mono text-foreground whitespace-pre-wrap break-words">{mathml}</code>
          </div>

          <Button onClick={handleCopy} variant="outline" size="sm" className="w-full gap-2 bg-transparent">
            <Copy className="w-4 h-4" />
            Copy Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
