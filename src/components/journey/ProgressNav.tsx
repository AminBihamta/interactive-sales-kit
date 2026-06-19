"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Baby,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  ClipboardPen,
  DollarSign,
  Home,
  type LucideIcon,
} from "lucide-react";
import {
  JOURNEY_STEPS,
  getJourneyHref,
  getStepIndex,
  resolveStepFromPath,
} from "@/lib/journey";
import type { JourneyStepId } from "@/lib/types";
import { springTransition } from "@/lib/animations";
import { useJourneyTransition } from "./JourneyTransition";
import { cn } from "@/lib/utils";

interface ProgressNavProps {
  slug: string;
}

const STEP_ICONS: Record<JourneyStepId, LucideIcon> = {
  home: Home,
  curriculum: BookOpen,
  programmes: Baby,
  schedule: Calendar,
  fees: DollarSign,
  register: ClipboardPen,
};

export function ProgressNav({ slug }: ProgressNavProps) {
  const pathname = usePathname();
  const currentStepId = resolveStepFromPath(pathname);
  const currentIndex = getStepIndex(currentStepId);
  const { start } = useJourneyTransition();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-brand-primary px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.15)]">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-1 overflow-x-auto pb-safe">
        {JOURNEY_STEPS.map((step, index) => {
          const isActive = step.id === currentStepId;
          const isCompleted = index < currentIndex;
          const href = getJourneyHref(slug, step);
          const StepIcon = STEP_ICONS[step.id];

          return (
            <div key={step.id} className="flex items-center">
              <Link
                href={href}
                onClick={
                  !isActive
                    ? (e) => {
                        e.preventDefault();
                        start(href, { x: e.clientX, y: e.clientY });
                      }
                    : undefined
                }
                className="relative shrink-0"
              >
                <motion.span
                  layout
                  transition={springTransition}
                  className={cn(
                    "flex min-h-12 min-w-[5.5rem] items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                    isActive &&
                      "bg-brand-secondary text-white shadow-lg shadow-brand-secondary/30",
                    isCompleted && !isActive && "bg-surface text-foreground",
                    !isActive &&
                      !isCompleted &&
                      "bg-white text-brand-primary hover:bg-white/90",
                  )}
                >
                  {isCompleted && !isActive && (
                    <Check className="size-3.5 text-brand-secondary" />
                  )}
                  <StepIcon className="size-3.5 shrink-0" aria-hidden />
                  {step.label}
                </motion.span>
                {isActive && (
                  <motion.span
                    layoutId="activeStepGlow"
                    className="absolute inset-0 -z-10 rounded-full bg-brand-secondary/20 blur-md"
                    transition={springTransition}
                  />
                )}
              </Link>
              {index < JOURNEY_STEPS.length - 1 && (
                <ChevronRight className="mx-0.5 size-4 shrink-0 text-white/60" />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
