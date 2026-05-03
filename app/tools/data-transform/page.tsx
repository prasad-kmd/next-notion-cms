"use client"

import { useState } from "react"
import {
  FileCode,
  ArrowRight,
  Copy,
  RefreshCcw,
  Binary,
  Globe,
  Hash,
  ArrowLeftRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import Link from "next/link"

export default function DataTransformPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const copyToClipboard = (text: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const handleBase64Encode = () => {
    try {
      setOutput(btoa(input))
    } catch (e) {
      toast.error("Invalid input for Base64 encoding")
    }
  }

  const handleBase64Decode = () => {
    try {
      setOutput(atob(input))
    } catch (e) {
      toast.error("Invalid Base64 input")
    }
  }

  const handleUrlEncode = () => {
    setOutput(encodeURIComponent(input))
  }

  const handleUrlDecode = () => {
    try {
      setOutput(decodeURIComponent(input))
    } catch (e) {
      toast.error("Invalid URL encoding")
    }
  }

  const handleHexEncode = () => {
    const hex = input.split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ")
    setOutput(hex)
  }

  const handleHexDecode = () => {
    try {
      const chars = input.replace(/\s/g, "").match(/.{1,2}/g) || []
      setOutput(chars.map(h => String.fromCharCode(parseInt(h, 16))).join(""))
    } catch (e) {
      toast.error("Invalid Hex input")
    }
  }

  const handleBinaryEncode = () => {
    const binary = input.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ")
    setOutput(binary)
  }

  const swapInputs = () => {
    setInput(output)
    setOutput("")
  }

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/tools"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Workspace
          </Link>
          <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
            <FileCode className="h-8 w-8 text-primary" />
            Data Transformation Suite
          </h1>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Comprehensive Base64, Hex, and URL encoding/decoding utilities for secure data handling.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Input Data</label>
                    <Button variant="ghost" size="sm" onClick={() => setInput("")} className="h-8 text-xs">Clear</Button>
                  </div>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter data here..."
                    className="min-h-[150px] font-mono bg-background/50"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 py-2 border-y border-border/50">
                  <Tabs defaultValue="base64" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                      <TabsTrigger value="base64" className="gap-2">
                        <Hash className="h-3 w-3" /> Base64
                      </TabsTrigger>
                      <TabsTrigger value="url" className="gap-2">
                        <Globe className="h-3 w-3" /> URL
                      </TabsTrigger>
                      <TabsTrigger value="hex" className="gap-2">
                        <Binary className="h-3 w-3" /> Hex
                      </TabsTrigger>
                      <TabsTrigger value="binary" className="gap-2">
                        <ArrowLeftRight className="h-3 w-3" /> Binary
                      </TabsTrigger>
                    </TabsList>

                    <div className="mt-6 flex flex-wrap gap-3 justify-center">
                      <TabsContent value="base64" className="m-0 flex gap-3">
                        <Button onClick={handleBase64Encode} className="gap-2">Encode</Button>
                        <Button onClick={handleBase64Decode} variant="outline" className="gap-2">Decode</Button>
                      </TabsContent>
                      <TabsContent value="url" className="m-0 flex gap-3">
                        <Button onClick={handleUrlEncode} className="gap-2">Encode</Button>
                        <Button onClick={handleUrlDecode} variant="outline" className="gap-2">Decode</Button>
                      </TabsContent>
                      <TabsContent value="hex" className="m-0 flex gap-3">
                        <Button onClick={handleHexEncode} className="gap-2">Encode</Button>
                        <Button onClick={handleHexDecode} variant="outline" className="gap-2">Decode</Button>
                      </TabsContent>
                      <TabsContent value="binary" className="m-0 flex gap-3">
                        <Button onClick={handleBinaryEncode} className="gap-2">Encode</Button>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>

                <div className="flex justify-center">
                    <Button variant="ghost" size="sm" onClick={swapInputs} className="gap-2 text-muted-foreground hover:text-primary">
                        <RefreshCcw className="h-4 w-4" /> Swap Input & Output
                    </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Output Data</label>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(output)} className="h-8 gap-2">
                        <Copy className="h-3 w-3" /> Copy
                    </Button>
                  </div>
                  <Textarea
                    value={output}
                    readOnly
                    placeholder="Result will appear here..."
                    className="min-h-[150px] font-mono bg-muted/30"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <section className="rounded-2xl border border-primary/10 bg-primary/5 p-8">
            <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
              <FileCode className="h-5 w-5 text-primary" />
              Technical Note
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This transformation suite operates entirely within your browser. No data is sent to any server, ensuring the confidentiality of your technical data and credentials during the conversion process.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
