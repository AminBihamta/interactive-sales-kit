"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Baby, Building, MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { centreCtaReveal, centrePanelSlide } from "@/lib/animations";
import { useJourneyTransition } from "@/components/journey/JourneyTransition";
import type { Centre } from "@/lib/types";
import { CentreProgrammeChips } from "./CentreProgrammeChips";

interface CentreHomePanelProps {
  centre: Centre;
  ready?: boolean;
}

export function CentreHomePanel({ centre, ready = true }: CentreHomePanelProps) {
  const { start } = useJourneyTransition();
  const curriculumHref = `/centres/${centre.slug}/curriculum`;

  return (
    <motion.div
      variants={centrePanelSlide}
      initial={ready ? "initial" : false}
      animate={ready ? "animate" : false}
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/10 lg:rounded-3xl"
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 lg:px-7 lg:py-7">
        <h1 className="text-3xl font-bold tracking-tight text-brand-primary lg:text-4xl">
          {centre.name}
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground lg:text-base">
          {centre.intro}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {centre.usps.map((usp) => (
            <Badge
              key={usp}
              variant="secondary"
              className="bg-surface text-brand-secondary"
            >
              <Sparkles className="mr-1 size-3" />
              {usp}
            </Badge>
          ))}
        </div>

        <CentreProgrammeChips centre={centre} className="mt-5" />

        <div className="mt-5 space-y-3 rounded-xl bg-surface p-4">
          <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
              <Baby className="size-3 shrink-0 text-brand-secondary" />
              Ages served
            </span>
            <span className="text-right text-sm font-semibold text-foreground">
              {centre.ageRange}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
              <MapPin className="size-3 shrink-0 text-brand-secondary" />
              Region
            </span>
            <span className="text-right text-sm font-semibold text-foreground">
              {centre.region}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
              <Building className="size-3 shrink-0 text-brand-secondary" />
              Address
            </span>
            <p className="line-clamp-2 text-right text-sm font-semibold leading-snug text-foreground">
              {centre.address}
            </p>
          </div>
        </div>
      </div>

      <motion.div
        variants={centreCtaReveal}
        initial={ready ? "initial" : false}
        animate={ready ? "animate" : false}
        className="shrink-0 border-t border-border/60 bg-white px-5 py-4 lg:px-7 lg:py-5"
      >
        <Link
          href={curriculumHref}
          onClick={(e) => {
            e.preventDefault();
            start(curriculumHref, { x: e.clientX, y: e.clientY });
          }}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-secondary/25 transition-colors hover:bg-brand-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2"
        >
          Start the journey
          <ArrowRight className="size-4" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
