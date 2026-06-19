"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  getAdjacentStep,
  getJourneyHref,
  resolveStepFromPath,
} from "@/lib/journey";
import { useJourneyTransition } from "./JourneyTransition";

interface SwipeNavigationProps {
  slug: string;
  children: React.ReactNode;
}

export function SwipeNavigation({ slug, children }: SwipeNavigationProps) {
  const pathname = usePathname();
  const { start } = useJourneyTransition();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStart.current.y;

      if (Math.abs(deltaX) < 80 || Math.abs(deltaY) > Math.abs(deltaX)) {
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
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pathname, slug, start]);

  return <>{children}</>;
}
