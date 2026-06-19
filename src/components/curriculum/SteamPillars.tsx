"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical,
  Cpu,
  Blocks,
  Palette,
  Calculator,
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
  const active = curriculum.steamPillars.find((p) => p.id === activeId)!;

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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {curriculum.montessoriAreas.map((area, i) => (
          <motion.div
            key={area.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border border-border bg-white p-4"
          >
            <h4 className="font-semibold text-brand-primary">{area.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              {area.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
