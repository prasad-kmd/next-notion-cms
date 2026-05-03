"use client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Copy, Eye } from "lucide-react"

interface ActionButtonsProps {
  mathml: string
  latex: string
  onViewMathML: () => void
}

export default function ActionButtons({
  mathml,
  latex,
  onViewMathML,
}: ActionButtonsProps) {
  const handleCopyMathML = async () => {
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

  const handleCopyLatex = async () => {
    try {
      await navigator.clipboard.writeText(latex)
      toast.success("Copied!", {
        description: "LaTeX code copied to clipboard",
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
    <div className="flex flex-col sm:flex-row gap-2 justify-end">
      <Button
        onClick={handleCopyLatex}
        disabled={!latex}
        variant="outline"
        size="sm"
        className="gap-2 bg-transparent text-xs rounded-lg"
      >
        <Copy className="w-3.5 h-3.5" />
        Copy LaTeX
      </Button>
      <Button
        onClick={handleCopyMathML}
        disabled={!mathml}
        variant="outline"
        size="sm"
        className="gap-2 bg-transparent text-xs rounded-lg"
      >
        <Copy className="w-3.5 h-3.5" />
        Copy MathML
      </Button>
      <Button
        onClick={onViewMathML}
        disabled={!mathml}
        size="sm"
        className="gap-2 text-xs rounded-lg"
      >
        <Eye className="w-3.5 h-3.5" />
        View MathML
      </Button>
    </div>
  )
}
