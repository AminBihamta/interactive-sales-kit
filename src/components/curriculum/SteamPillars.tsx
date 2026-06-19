"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical,
  Cpu,
  Blocks,
  Palette,
  Calculator,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CurriculumContent } from "@/lib/types";
import { fadeTransition } from "@/lib/animations";

const ICON_MAP = {
  flask: FlaskConical,
  cpu: Cpu,
  blocks: Blocks,
  palette: Palette,
  calculator: Calculator,
} as const;

interface SteamPillarsProps {
  curriculum: CurriculumContent;
}

export function SteamPillars({ curriculum }: SteamPillarsProps) {
  const [activeId, setActiveId] = useState(curriculum.steamPillars[0].id);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const active = curriculum.steamPillars.find((p) => p.id === activeId)!;

  const updateScrollHints = useCallback(() => {
    const row = scrollRef.current;
    if (!row) return;

    const hasOverflow = row.scrollWidth > row.clientWidth + 1;
    const atStart = row.scrollLeft <= 2;
    const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 2;

    setCanScrollLeft(hasOverflow && !atStart);
    setCanScrollRight(hasOverflow && !atEnd);
  }, []);

  useEffect(() => {
    const row = scrollRef.current;
    if (!row) return;

    updateScrollHints();
    row.addEventListener("scroll", updateScrollHints, { passive: true });
    window.addEventListener("resize", updateScrollHints);

    const observer = new ResizeObserver(updateScrollHints);
    observer.observe(row);

    return () => {
      row.removeEventListener("scroll", updateScrollHints);
      window.removeEventListener("resize", updateScrollHints);
      observer.disconnect();
    };
  }, [updateScrollHints, curriculum.montessoriAreas.length]);

  return (
    <div className="space-y-6">
      <p className="text-base leading-relaxed text-muted-foreground">
        {curriculum.intro}
      </p>

      <div className="flex flex-wrap gap-2">
        {curriculum.steamPillars.map((pillar) => {
          const Icon = ICON_MAP[pillar.icon as keyof typeof ICON_MAP] ?? Blocks;
          const isActive = pillar.id === activeId;
          return (
            <button
              key={pillar.id}
              type="button"
              onClick={() => setActiveId(pillar.id)}
              className={cn(
                "flex min-h-12 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all",
                isActive
                  ? "bg-brand-secondary text-white shadow-md"
                  : "bg-surface text-foreground hover:bg-surface/80",
              )}
            >
              <Icon className="size-4" />
              {pillar.shortTitle}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={fadeTransition}
          className="rounded-2xl bg-surface p-8"
        >
          <h3 className="text-xl font-bold text-brand-secondary">
            {active.title}
          </h3>
          <p className="mt-3 text-base leading-relaxed">{active.description}</p>
        </motion.div>
      </AnimatePresence>

      <div className="relative">
        <div
          ref={scrollRef}
          className="brand-scroll flex gap-3 overflow-x-auto overscroll-x-contain pb-3"
        >
          {curriculum.montessoriAreas.map((area, i) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="w-[min(280px,78vw)] shrink-0 rounded-xl border border-border bg-white p-4"
            >
              <h4 className="font-semibold text-brand-primary">{area.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {area.description}
              </p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center bg-gradient-to-r from-background via-background/80 to-transparent pl-1 pr-8"
            >
              <ChevronLeft className="size-5 text-brand-primary" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canScrollRight && (
            <motion.div
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 4 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-background via-background/80 to-transparent pl-8 pr-1"
            >
              <ChevronRight className="size-5 text-brand-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
