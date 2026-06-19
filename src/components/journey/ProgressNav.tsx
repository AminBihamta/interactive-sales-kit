"use client";

import { useEffect, useRef } from "react";
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
  Home,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
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
  fees: Receipt,
  register: ClipboardPen,
};

export function ProgressNav({ slug }: ProgressNavProps) {
  const pathname = usePathname();
  const currentStepId = resolveStepFromPath(pathname);
  const currentIndex = getStepIndex(currentStepId);
  const { start } = useJourneyTransition();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const syncNavHeight = () => {
      document.documentElement.style.setProperty(
        "--journey-nav-height",
        `${nav.getBoundingClientRect().height}px`,
      );
    };

    syncNavHeight();
    const observer = new ResizeObserver(syncNavHeight);
    observer.observe(nav);
    window.addEventListener("resize", syncNavHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncNavHeight);
    };
  }, []);

  return (
    <div
      ref={navRef}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-4 pb-safe sm:px-4"
    >
      <nav
        aria-label="Journey progress"
        className={cn(
          "pointer-events-auto w-full max-w-6xl rounded-2xl border border-white/30 px-3 py-2 sm:px-4",
          "bg-brand-primary/85 backdrop-blur-xl backdrop-saturate-150",
          "shadow-[0_12px_40px_rgba(0,0,0,0.28),0_2px_8px_rgba(205,33,51,0.18),inset_0_1px_0_rgba(255,255,255,0.18)]",
          "ring-1 ring-black/10",
          "motion-reduce:bg-brand-primary motion-reduce:backdrop-blur-none",
        )}
      >
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <Link
            href="/"
            className="shrink-0 rounded-lg border-r border-white/25 pr-2 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:pr-3"
            aria-label="All centres"
          >
            <BrandLogo variant="white" className="h-8 w-auto md:h-9" />
          </Link>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto">
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
                        "flex min-h-10 min-w-[5.5rem] items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                        isActive &&
                          "bg-brand-secondary text-white shadow-lg shadow-brand-secondary/30",
                        isCompleted &&
                          !isActive &&
                          "bg-white/25 text-white hover:bg-white/30",
                        !isActive &&
                          !isCompleted &&
                          "bg-white/15 text-white hover:bg-white/22",
                      )}
                    >
                      {isCompleted && !isActive && (
                        <Check className="size-3.5 text-white/90" />
                      )}
                      <StepIcon className="size-3.5 shrink-0" aria-hidden />
                      {step.label}
                    </motion.span>
                    {isActive && (
                      <motion.span
                        layoutId="activeStepGlow"
                        className="absolute inset-0 -z-10 rounded-full bg-brand-secondary/25 blur-md motion-reduce:blur-none"
                        transition={springTransition}
                      />
                    )}
                  </Link>
                  {index < JOURNEY_STEPS.length - 1 && (
                    <ChevronRight
                      className="mx-0.5 size-4 shrink-0 text-white/70"
                      aria-hidden
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
