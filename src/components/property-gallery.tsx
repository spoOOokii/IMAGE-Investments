"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type PropertyGalleryProps = {
  images: string[];
  alt: string;
};

export function PropertyGallery({ images, alt }: PropertyGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  function move(direction: number) {
    setActiveImage((current) => (current + direction + images.length) % images.length);
  }

  useEffect(() => {
    if (!isLightboxOpen) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (event.key === "ArrowLeft") {
        move(-1);
      } else if (event.key === "ArrowRight") {
        move(1);
      }
    }

    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLightboxOpen]);

  return (
    <>
      <div className="space-y-4">
        <div className="luxury-surface relative aspect-[1.35] overflow-hidden">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="absolute inset-0 z-10 cursor-zoom-in"
            aria-label="Open gallery full screen"
          />
          <Image
            src={images[activeImage]}
            alt={alt}
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => move(-1)}
            className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(8,23,40,0.55)] text-white"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(8,23,40,0.55)] text-white"
            aria-label="Next image"
          >
            →
          </button>
          <span className="absolute bottom-4 right-4 z-20 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
            {activeImage + 1} / {images.length}
          </span>
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

      {isLightboxOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
            aria-label="Close"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              move(-1);
            }}
            className="absolute left-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Previous"
          >
            ←
          </button>
          <div
            className="relative h-full max-h-[85vh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={images[activeImage]}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              move(1);
            }}
            className="absolute right-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Next"
          >
            →
          </button>
          <span className="absolute bottom-6 rounded-full bg-black/60 px-4 py-1 text-sm text-white">
            {activeImage + 1} / {images.length}
          </span>
        </div>
      ) : null}
    </>
  );
}
