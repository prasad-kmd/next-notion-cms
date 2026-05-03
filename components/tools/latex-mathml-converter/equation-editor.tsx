"use client"

import { useRef } from "react"
import type React from "react"

import { EquationPreview } from "./equation-preview"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import InputControls from "./InputControls"

interface EquationEditorProps {
  latex: string
  mathml: string
  onLatexChange: (value: string) => void
}

export default function EquationEditor({ latex, mathml, onLatexChange }: EquationEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleClear = () => {
    onLatexChange("")
    textareaRef.current?.focus()
  }

  const handleMoveLeft = () => {
    if (textareaRef.current) {
      const { selectionStart } = textareaRef.current
      const newPosition = Math.max(0, selectionStart - 1)
      textareaRef.current.selectionStart = newPosition
      textareaRef.current.selectionEnd = newPosition
      textareaRef.current.focus()
    }
  }

  const handleMoveRight = () => {
    if (textareaRef.current) {
      const { selectionStart } = textareaRef.current
      const newPosition = Math.min(latex.length, selectionStart + 1)
      textareaRef.current.selectionStart = newPosition
      textareaRef.current.selectionEnd = newPosition
      textareaRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget
    const { selectionStart, selectionEnd, value } = target

    if (selectionStart === null || selectionEnd === null) return

    const bracketPairs: { [key: string]: string } = {
      "(": ")",
      "[": "]",
      "{": "}",
    }

    const char = e.key

    if (char in bracketPairs) {
      e.preventDefault()
      const closingBracket = bracketPairs[char]

      // Insert opening bracket and closing bracket
      const newValue = value.slice(0, selectionStart) + char + closingBracket + value.slice(selectionEnd)
      onLatexChange(newValue)

      // Move cursor between the brackets
      setTimeout(() => {
        target.selectionStart = selectionStart + 1
        target.selectionEnd = selectionStart + 1
      }, 0)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-foreground">Equation Editor</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Section */}
        <div className="space-y-2">
          <Label htmlFor="latex-input" className="text-xs font-medium text-muted-foreground">
            LaTeX Input
          </Label>
          <Textarea
            id="latex-input"
            ref={textareaRef}
            placeholder="Enter LaTeX or select symbols above..."
            value={latex}
            onChange={(e) => onLatexChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-40 font-mono text-sm resize-none border-border rounded-xl bg-card focus:ring-primary/20"
          />
          <InputControls onClear={handleClear} onMoveLeft={handleMoveLeft} onMoveRight={handleMoveRight} />
        </div>

        {/* Preview Section */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Live Preview</Label>
          <div className="h-40 border border-border rounded-xl bg-card/50 backdrop-blur-sm p-4 flex items-center justify-center overflow-auto shadow-inner">
            <EquationPreview mathml={mathml} />
          </div>
        </div>
      </div>
    </div>
  )
}
