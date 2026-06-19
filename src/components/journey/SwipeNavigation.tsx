"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getAdjacentStep,
  getJourneyHref,
  resolveStepFromPath,
} from "@/lib/journey";
import { cn } from "@/lib/utils";
import { useJourneyTransition } from "./JourneyTransition";

interface SwipeNavigationProps {
  slug: string;
  children: React.ReactNode;
}

interface SwipePreview {
  direction: "prev" | "next";
  label: string;
  progress: number;
}

const SWIPE_THRESHOLD = 80;
const PREVIEW_START = 20;

export function SwipeNavigation({ slug, children }: SwipeNavigationProps) {
  const pathname = usePathname();
  const { start } = useJourneyTransition();
  const reducedMotion = useReducedMotion();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [swipePreview, setSwipePreview] = useState<SwipePreview | null>(null);

  useEffect(() => {
    const clearPreview = () => setSwipePreview(null);

    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      clearPreview();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart.current || reducedMotion) return;

      const deltaX = e.touches[0].clientX - touchStart.current.x;
      const deltaY = e.touches[0].clientY - touchStart.current.y;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        clearPreview();
        return;
      }

      if (Math.abs(deltaX) < PREVIEW_START) {
        clearPreview();
        return;
      }

      const direction = deltaX < 0 ? "next" : "prev";
      const adjacent = getAdjacentStep(resolveStepFromPath(pathname), direction);

      if (!adjacent) {
        clearPreview();
        return;
      }

      setSwipePreview({
        direction,
        label: adjacent.label,
        progress: Math.min(Math.abs(deltaX) / SWIPE_THRESHOLD, 1),
      });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStart.current.y;

      clearPreview();

      if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaY) > Math.abs(deltaX)) {
        touchStart.current = null;
        return;
      }

      const stepId = resolveStepFromPath(pathname);
      const direction = deltaX < 0 ? "next" : "prev";
      const adjacent = getAdjacentStep(stepId, direction);

      if (adjacent) {
        start(getJourneyHref(slug, adjacent), {
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY,
        });
      }

      touchStart.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", clearPreview, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", clearPreview);
    };
  }, [pathname, slug, start, reducedMotion]);

  return (
    <>
      {children}

      {swipePreview && !reducedMotion && (
        <>
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none fixed inset-y-0 z-40 w-24",
              swipePreview.direction === "next"
                ? "right-0 bg-gradient-to-l from-brand-primary/35 to-transparent"
                : "left-0 bg-gradient-to-r from-brand-primary/35 to-transparent",
            )}
            style={{ opacity: 0.35 + swipePreview.progress * 0.65 }}
          />

          <motion.div
            aria-live="polite"
            aria-atomic="true"
            className={cn(
              "pointer-events-none fixed top-1/2 z-40 flex max-w-[min(18rem,calc(100vw-2rem))] -translate-y-1/2 items-center gap-2 rounded-full bg-brand-primary px-4 py-3 text-white shadow-xl shadow-brand-primary/30",
              swipePreview.direction === "next" ? "right-4" : "left-4",
            )}
            initial={false}
            animate={{
              opacity: 0.4 + swipePreview.progress * 0.6,
              x:
                swipePreview.direction === "next"
                  ? (1 - swipePreview.progress) * 28
                  : (1 - swipePreview.progress) * -28,
              scale: 0.94 + swipePreview.progress * 0.06,
            }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            {swipePreview.direction === "prev" && (
              <ChevronLeft className="size-5 shrink-0" aria-hidden />
            )}
            <span className="min-w-0 text-sm font-semibold leading-tight">
              <span className="block text-[10px] font-medium uppercase tracking-wide text-white/75">
                {swipePreview.direction === "next" ? "Next" : "Back"}
              </span>
              {swipePreview.label}
            </span>
            {swipePreview.direction === "next" && (
              <ChevronRight className="size-5 shrink-0" aria-hidden />
            )}
          </motion.div>
        </>
      )}
    </>
  );
}
