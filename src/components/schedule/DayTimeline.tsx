"use client";

import { useState } from "react";
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
  const active = schedule.blocks[activeIndex];
  const Icon = ICON_MAP[active.icon] ?? Blocks;

  return (
    <div className="space-y-6">
      <p className="rounded-xl bg-brand-primary/5 px-4 py-3 text-sm text-muted-foreground">
        {schedule.disclaimer}
      </p>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-2">
          {schedule.blocks.map((block, index) => {
            const BlockIcon = ICON_MAP[block.icon] ?? Blocks;
            const isActive = index === activeIndex;
            return (
              <button
                key={block.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all ${
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

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
            {activeIndex < schedule.blocks.length - 1 && (
              <Button
                variant="secondary"
                className="mt-6 self-start"
                onClick={() => setActiveIndex(activeIndex + 1)}
              >
                Next period
                <ChevronRight className="size-4" />
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
