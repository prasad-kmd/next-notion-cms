"use client"

import { useState, useCallback } from "react"
import {
  FileArchive,
  Upload,
  Download,
  Trash2,
  ArrowRight,
  Check,
  AlertCircle,
  Zap,
  ShieldCheck,
  Cpu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"

type CompressionFormat = "gzip" | "deflate" | "deflate-raw"

export default function CompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState<CompressionFormat>("gzip")
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setOriginalSize(selectedFile.size)
      setResultBlob(null)
      setCompressedSize(0)
    }
  }

  const compressFile = async () => {
    if (!file) return

    setIsProcessing(true)
    try {
      const stream = file.stream()
      // @ts-expect-error - CompressionStream is a newer browser API
      const compressionStream = new CompressionStream(format)
      const compressedStream = stream.pipeThrough(compressionStream)

      const response = new Response(compressedStream)
      const blob = await response.blob()

      setResultBlob(blob)
      setCompressedSize(blob.size)
      toast.success("Compression complete!")
    } catch (err) {
      console.error(err)
      toast.error("Compression failed. Your browser might not support CompressionStream.")
    } finally {
      setIsProcessing(false)
    }
  }

  const decompressFile = async () => {
    if (!file) return

    setIsProcessing(true)
    try {
      const stream = file.stream()
      // @ts-expect-error - DecompressionStream is a newer browser API
      const decompressionStream = new DecompressionStream(format)
      const decompressedStream = stream.pipeThrough(decompressionStream)

      const response = new Response(decompressedStream)
      const blob = await response.blob()

      setResultBlob(blob)
      setCompressedSize(blob.size)
      toast.success("Decompression complete!")
    } catch (err) {
      console.error(err)
      toast.error("Decompression failed. Make sure the file and format are correct.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resultBlob || !file) return

    const url = URL.createObjectURL(resultBlob)
    const a = document.createElement("a")
    a.href = url
    // Append appropriate extension if possible, or just add .compressed
    a.download = `${file.name}.${format === 'gzip' ? 'gz' : format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    setFile(null)
    setResultBlob(null)
    setOriginalSize(0)
    setCompressedSize(0)
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const compressionRatio = originalSize > 0 && compressedSize > 0
    ? ((1 - compressedSize / originalSize) * 100).toFixed(2)
    : null

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
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold font-serif flex items-center gap-3">
                <FileArchive className="h-8 w-8 text-primary" />
                Stream Compressor
              </h1>
              <p className="mt-2 text-muted-foreground">
                High-performance file compression using the native browser Compression Streams API.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-1">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-8">
            <div className="flex flex-col items-center justify-center space-y-6">
              {!file ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-muted-foreground/25 rounded-2xl cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
                    <p className="mb-2 text-sm font-semibold font-sans">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground font-sans">Any file (Max 100MB recommended for browser stability)</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
              ) : (
                <div className="w-full space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <FileArchive className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold font-sans truncate max-w-[200px] md:max-w-md">{file.name}</p>
                        <p className="text-xs text-muted-foreground font-sans">{formatSize(file.size)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleClear} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Algorithm</label>
                      <div className="flex flex-wrap gap-2">
                        {(["gzip", "deflate", "deflate-raw"] as CompressionFormat[]).map((f) => (
                          <Button
                            key={f}
                            variant={format === f ? "default" : "outline"}
                            onClick={() => setFormat(f)}
                            className="text-xs uppercase font-bold font-mono"
                          >
                            {f}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-end gap-3">
                      <Button
                        onClick={compressFile}
                        className="flex-1 gap-2"
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Compress"}
                      </Button>
                      <Button
                        onClick={decompressFile}
                        variant="secondary"
                        className="flex-1 gap-2"
                        disabled={isProcessing}
                      >
                        Decompress
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {resultBlob && (
                <div className="w-full mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center md:text-left">
                      <p className="text-sm font-semibold text-muted-foreground uppercase">Resulting Size</p>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold font-sans">{formatSize(compressedSize)}</span>
                        {compressionRatio && Number(compressionRatio) > 0 && (
                          <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-xs font-bold">
                            Saved {compressionRatio}%
                          </span>
                        )}
                      </div>
                    </div>
                    <Button onClick={handleDownload} size="lg" className="gap-2 w-full md:w-auto">
                      <Download className="h-5 w-5" /> Download Result
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <Zap className="h-8 w-8 text-amber-500 mb-4" />
            <h3 className="mb-2 font-bold font-sans">Streaming API</h3>
            <p className="text-sm text-muted-foreground font-sans">
              Uses the modern W3C Compression Streams API for memory-efficient processing without loading entire files into RAM.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <ShieldCheck className="h-8 w-8 text-emerald-500 mb-4" />
            <h3 className="mb-2 font-bold font-sans">Local Processing</h3>
            <p className="text-sm text-muted-foreground font-sans">
              All compression and decompression occurs entirely within your browser. No data is ever uploaded to a server.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <Cpu className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="mb-2 font-bold font-sans">Native Formats</h3>
            <p className="text-sm text-muted-foreground font-sans">
              Supports GZIP and DEFLATE standards, compatible with most operating systems and development environments.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
