"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { carouselSlide } from "@/lib/animations";
import type { Centre } from "@/lib/types";
import { CentreSpotlightCard } from "./CentreSpotlightCard";

interface CentreCarouselProps {
  centres: Centre[];
  filterKey: string;
}

export function CentreCarousel({ centres, filterKey }: CentreCarouselProps) {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: centres.length > 1,
    containScroll: false,
    watchDrag: false,
    duration: 0,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setReady(true);
  }, []);

  const syncSelectedIndex = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    syncSelectedIndex();
    emblaApi.on("select", syncSelectedIndex);
    emblaApi.on("reInit", syncSelectedIndex);

    return () => {
      emblaApi.off("select", syncSelectedIndex);
      emblaApi.off("reInit", syncSelectedIndex);
    };
  }, [emblaApi, syncSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(0, true);
    setSelectedIndex(0);
  }, [emblaApi, filterKey, centres.length]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev(true);
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext(true);
  }, [emblaApi]);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (!emblaApi || index === selectedIndex) return;
      emblaApi.scrollTo(index, true);
      setSelectedIndex(index);
    },
    [emblaApi, selectedIndex],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!emblaApi) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [emblaApi, scrollPrev, scrollNext]);

  if (centres.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-white/70">
        No centres match this filter.
      </div>
    );
  }

  return (
    <section
      className="relative w-screen max-w-none shrink-0"
      aria-label="Select a centre"
    >
      <div className="relative">
        {centres.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous centre"
              onClick={scrollPrev}
              className="absolute left-3 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-lg backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 lg:left-6"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Next centre"
              onClick={scrollNext}
              className="absolute right-3 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-lg backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 lg:right-6"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}

        <div className="w-full overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {centres.map((centre, index) => (
              <motion.div
                key={centre.slug}
                variants={carouselSlide}
                initial={ready && !reducedMotion ? "initial" : false}
                animate={ready && !reducedMotion ? "animate" : false}
                transition={{ delay: reducedMotion ? 0 : 0.5 + index * 0.06 }}
                className="min-w-0 shrink-0 grow-0 basis-[31%] sm:basis-[30%]"
              >
                <div className="h-[min(42vh,400px)]">
                  <CentreSpotlightCard
                    centre={centre}
                    isActive={selectedIndex === index}
                    index={index}
                    onSelect={scrollToIndex}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <p
        className="mt-6 text-center text-sm font-medium tabular-nums text-white/70"
        aria-live="polite"
      >
        {selectedIndex + 1} / {centres.length}
      </p>
    </section>
  );
}
