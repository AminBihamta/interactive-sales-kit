"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sunrise,
  Users,
  Blocks,
  Apple,
  TreePine,
  Utensils,
  Moon,
  Palette,
  Coffee,
  Home,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ScheduleContent } from "@/lib/types";
import { fadeTransition } from "@/lib/animations";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  sunrise: Sunrise,
  users: Users,
  blocks: Blocks,
  apple: Apple,
  tree: TreePine,
  utensils: Utensils,
  moon: Moon,
  palette: Palette,
  coffee: Coffee,
  home: Home,
};

interface DayTimelineProps {
  schedule: ScheduleContent;
}

export function DayTimeline({ schedule }: DayTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const active = schedule.blocks[activeIndex];
  const Icon = ICON_MAP[active.icon] ?? Blocks;

  const updateScrollHint = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const hasOverflow = list.scrollHeight > list.clientHeight + 1;
    const atBottom =
      list.scrollTop + list.clientHeight >= list.scrollHeight - 2;

    setCanScrollDown(hasOverflow && !atBottom);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    updateScrollHint();
    list.addEventListener("scroll", updateScrollHint, { passive: true });
    window.addEventListener("resize", updateScrollHint);

    const observer = new ResizeObserver(updateScrollHint);
    observer.observe(list);

    return () => {
      list.removeEventListener("scroll", updateScrollHint);
      window.removeEventListener("resize", updateScrollHint);
      observer.disconnect();
    };
  }, [updateScrollHint, schedule.blocks.length]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const activeButton = list.querySelector<HTMLElement>(
      `[data-schedule-index="${activeIndex}"]`,
    );
    activeButton?.scrollIntoView({ block: "nearest" });
    updateScrollHint();
  }, [activeIndex, updateScrollHint]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="relative flex-1">
          <div
            ref={listRef}
            className="schedule-list-scroll max-h-[calc(6*3rem+5*0.5rem)] space-y-2 overflow-y-auto overscroll-contain pr-2"
          >
            {schedule.blocks.map((block, index) => {
              const BlockIcon = ICON_MAP[block.icon] ?? Blocks;
              const isActive = index === activeIndex;
              return (
                <button
                  key={block.id}
                  type="button"
                  data-schedule-index={index}
                  onClick={() => setActiveIndex(index)}
                  className={`flex min-h-12 w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all ${
                    isActive
                      ? "bg-brand-secondary text-white shadow-md"
                      : "bg-surface hover:bg-surface/80"
                  }`}
                >
                  <BlockIcon className="size-5 shrink-0" />
                  <span className="w-24 shrink-0 text-sm font-mono font-semibold">
                    {block.time}
                  </span>
                  <span className="font-medium">{block.title}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {canScrollDown && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-background via-background/80 to-transparent pb-1 pt-8"
              >
                <ChevronDown className="size-5 text-brand-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
            className="flex flex-1 flex-col justify-center rounded-2xl bg-surface p-8"
          >
            <Icon className="size-12 text-brand-secondary" />
            <p className="mt-4 font-mono text-sm font-semibold text-brand-secondary">
              {active.time}
            </p>
            <h3 className="mt-2 text-2xl font-bold">{active.title}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {active.description}
            </p>
            <AnimatePresence>
              {activeIndex < schedule.blocks.length - 1 && (
                <motion.div
                  key={`next-${active.id}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={fadeTransition}
                  className="mt-6 self-start"
                >
                  <Button
                    variant="secondary"
                    onClick={() => setActiveIndex(activeIndex + 1)}
                  >
                    Next period
                    <ChevronRight className="size-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
