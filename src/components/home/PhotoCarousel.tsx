"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PhotoCarouselProps {
  images: string[];
  alt: string;
}

export function PhotoCarousel({ images, alt }: PhotoCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" }, [
    Autoplay({ delay: 4500, stopOnInteraction: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  return (
    <div className="relative mb-8">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="relative min-w-0 shrink-0 grow-0 basis-full"
            >
              <div className="relative aspect-[21/9] overflow-hidden bg-surface">
                <motion.div
                  animate={{
                    scale: selectedIndex === index ? 1.04 : 1,
                  }}
                  transition={{ duration: 4, ease: "linear" }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={src}
                    alt={`${alt} photo ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={index === 0}
                  />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300",
              selectedIndex === index
                ? "w-8 bg-brand-secondary"
                : "w-2.5 bg-brand-secondary/30",
            )}
          />
        ))}
      </div>
    </div>
  );
}
