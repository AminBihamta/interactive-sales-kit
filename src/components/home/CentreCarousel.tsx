"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { carouselSlide } from "@/lib/animations";
import type { Centre } from "@/lib/types";
import { CentreSpotlightCard } from "./CentreSpotlightCard";

interface CentreCarouselProps {
  centres: Centre[];
  filterKey: string;
}

function getSnapState(emblaApi: EmblaCarouselType) {
  const engine = emblaApi.internalEngine();
  const index = engine.index.get();
  const snaps = emblaApi.scrollSnapList();
  const current = engine.location.get();
  const snapTarget = snaps[index] ?? 0;
  const minDistance = Math.abs(snapTarget - current);
  return { index, minDistance };
}

export function CentreCarousel({ centres, filterKey }: CentreCarouselProps) {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: centres.length > 1,
    containScroll: false,
    dragFree: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const lastSnapRef = useRef<number | null>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  const commitSelectedIndex = useCallback(
    (embla: EmblaCarouselType) => {
      setSelectedIndex(getSnapState(embla).index);
    },
    [],
  );

  const onSettle = useCallback(() => {
    if (!emblaApi) return;
    const { index, minDistance } = getSnapState(emblaApi);
    const alreadySnapped =
      minDistance < 1 || lastSnapRef.current === index;

    commitSelectedIndex(emblaApi);

    if (alreadySnapped) {
      lastSnapRef.current = null;
      return;
    }

    lastSnapRef.current = index;
    emblaApi.scrollTo(index, true);
  }, [emblaApi, commitSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    const resetSnapGuard = () => {
      lastSnapRef.current = null;
    };
    const onReInit = () => commitSelectedIndex(emblaApi);

    commitSelectedIndex(emblaApi);
    emblaApi.on("pointerDown", resetSnapGuard);
    emblaApi.on("settle", onSettle);
    emblaApi.on("reInit", onReInit);
    return () => {
      emblaApi.off("pointerDown", resetSnapGuard);
      emblaApi.off("settle", onSettle);
      emblaApi.off("reInit", onReInit);
    };
  }, [emblaApi, commitSelectedIndex, onSettle]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(0, true);
    setSelectedIndex(0);
  }, [emblaApi, filterKey, centres.length]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    lastSnapRef.current = null;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    lastSnapRef.current = null;
    emblaApi.scrollNext();
  }, [emblaApi]);

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
        <div className="flex touch-pan-y">
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
