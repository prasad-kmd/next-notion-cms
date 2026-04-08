"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X } from "lucide-react"

interface GalleryImage {
  src: string
  alt: string
  title: string
  category: string
}

interface GalleryClientProps {
  images: GalleryImage[]
}

export default function GalleryClient({ images }: GalleryClientProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted transition-all hover:shadow-2xl cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1 block">
                {image.category}
              </span>
              <h3 className="text-xl font-bold text-white">{image.title}</h3>
              <p className="text-sm text-gray-300 mt-2 line-clamp-2">{image.alt}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          <DialogHeader className="sr-only">
             <DialogTitle>{selectedImage?.title}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video w-full">
            {selectedImage && (
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
              />
            )}
          </div>
          <div className="bg-background/80 backdrop-blur-md p-6">
             <div className="flex justify-between items-start">
                <div>
                   <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1 block">
                     {selectedImage?.category}
                   </span>
                   <h2 className="text-2xl font-bold philosopher">{selectedImage?.title}</h2>
                   <p className="text-muted-foreground mt-2">{selectedImage?.alt}</p>
                </div>
                <button 
                   onClick={() => setSelectedImage(null)}
                   className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                   <X className="h-6 w-6" />
                </button>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
