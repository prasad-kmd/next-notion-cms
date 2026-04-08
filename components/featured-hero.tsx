"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface HeroItem {
  title: string
  description: string
  image: string
  link: string
  label: string
}

interface FeaturedHeroProps {
  items: HeroItem[]
}

export default function FeaturedHero({ items }: FeaturedHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isInView, setIsInView] = useState(true)
  const containerRef = useRef<HTMLElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef(0)
  const duration = 8000 // 8 seconds per slide

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const stopTimer = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
  }, [])

  const handleNext = useCallback(() => {
    progressRef.current = 0
    setProgress(0)
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const startTimer = useCallback(() => {
    stopTimer()
    const startTime = Date.now() - (progressRef.current / 100) * duration
    
    autoPlayRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      progressRef.current = newProgress
      setProgress(newProgress)
      
      if (newProgress >= 100) {
        handleNext()
      }
    }, 50)
  }, [duration, stopTimer, handleNext])

  useEffect(() => {
    if (!isHovered && isInView) {
      startTimer()
    } else {
      stopTimer()
    }
    return () => stopTimer()
  }, [currentIndex, isHovered, isInView, startTimer, stopTimer])

  const handlePrev = useCallback(() => {
    progressRef.current = 0
    setProgress(0)
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  const handleSelect = useCallback((index: number) => {
    if (index === currentIndex) return
    progressRef.current = 0
    setProgress(0)
    setCurrentIndex(index)
  }, [currentIndex])

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[calc(100vh-4rem)] min-h-[600px] overflow-hidden group bg-black border-b border-border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Images */}
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {(index === currentIndex || Math.abs(index - currentIndex) <= 1) && (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
              quality={85}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent lg:bg-gradient-to-r lg:from-black/80 lg:via-black/20 lg:to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center px-6 lg:px-20 pb-32 lg:pb-0">
        <div className="max-w-3xl text-white">
          <div 
            key={`label-${currentIndex}`}
            className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-1 text-xs font-bold text-primary backdrop-blur-md border border-primary/30 animate-in fade-in slide-in-from-left-4 duration-700 local-jetbrains-mono"
          >
            {items[currentIndex].label}
          </div>
          <h1 
            key={`title-${currentIndex}`}
            className="mb-6 text-4xl font-bold lg:text-7xl amoriaregular text-balance animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            {items[currentIndex].title}
          </h1>
          <p 
            key={`desc-${currentIndex}`}
            className="mb-8 max-w-xl text-lg text-gray-200 line-clamp-3 lg:line-clamp-none animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 google-sans"
          >
            {items[currentIndex].description}
          </p>
          <div 
            key={`btn-${currentIndex}`}
            className="flex gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200"
          >
            <Link
              href={items[currentIndex].link}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 shadow-[0_0_20px_rgba(var(--primary),0.3)] noto-sans-display"
            >
              Learn More
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition-all hover:bg-black/40 opacity-0 group-hover:opacity-100 hidden lg:block"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition-all hover:bg-black/40 opacity-0 group-hover:opacity-100 hidden lg:block"
        aria-label="Next slide"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Bottom Nav Bar */}
      <div className="absolute bottom-8 left-0 right-0 z-20 px-6 lg:px-20">
        <div className="mx-auto flex max-w-8xl items-center justify-center gap-2 lg:gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={cn(
                "group/item relative flex flex-col min-w-[120px] lg:min-w-[180px] p-3 rounded-lg border transition-all text-left",
                index === currentIndex 
                  ? "bg-white/10 border-primary/50 backdrop-blur-md" 
                  : "bg-black/40 border-white/5 hover:bg-white/5 backdrop-blur-sm"
              )}
            >
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-wider mb-0.5 transition-colors space-mono",
                index === currentIndex ? "text-primary" : "text-gray-400 group-hover/item:text-gray-200"
              )}>
                {item.label}
              </span>
              <span className="text-xs font-bold text-white line-clamp-1 local-inter">
                {item.title}
              </span>
              
              {/* Progress Bar Container */}
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                {index === currentIndex ? (
                  <div 
                    className="h-full bg-primary transition-all duration-50 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                ) : (
                  <div className="h-full w-0 bg-white/20" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
