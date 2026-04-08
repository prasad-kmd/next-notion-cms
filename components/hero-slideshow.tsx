"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/img/hero/1.webp",
  "/img/hero/2.webp",
  "/img/hero/3.webp",
  "/img/hero/4.webp",
];

export default function HeroSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt="Hero background image"
          fill
          className={`object-cover transition-opacity duration-1000 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
          priority={index === 0}
        />
      ))}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
