"use client";

import Image from "next/image";
import { useState } from "react";

type PropertyGalleryProps = {
  images: string[];
  alt: string;
};

export function PropertyGallery({ images, alt }: PropertyGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);

  function move(direction: number) {
    setActiveImage((current) => (current + direction + images.length) % images.length);
  }

  return (
    <div className="space-y-4">
      <div className="luxury-surface relative aspect-[1.35] overflow-hidden">
        <Image
          src={images[activeImage]}
          alt={alt}
          fill
          className="object-cover"
        />
        <button
          type="button"
          onClick={() => move(-1)}
          className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(8,23,40,0.55)] text-white"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(8,23,40,0.55)] text-white"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {images.slice(0, 5).map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveImage(index)}
            className={[
              "relative aspect-square overflow-hidden rounded-2xl border",
              index === activeImage
                ? "border-[var(--color-gold)]"
                : "border-transparent",
            ].join(" ")}
          >
            <Image src={image} alt={`${alt} ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
