"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getAllCentres } from "@/lib/centres";
import { HomeHeroPanel, type Filter } from "./HomeHeroPanel";
import { CentreCarousel } from "./CentreCarousel";
import { HomeHeroBackground } from "./HomeHeroBackground";

export function HomepageShell() {
  const [filter, setFilter] = useState<Filter>("all");
  const allCentres = useMemo(() => getAllCentres(), []);

  const centres = useMemo(() => {
    const filtered =
      filter === "all"
        ? allCentres
        : allCentres.filter((c) => c.region === filter);
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [allCentres, filter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative flex h-dvh max-h-dvh flex-col overflow-hidden bg-brand-primary"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(78,115,138,0.35) 0%, transparent 55%)",
        }}
      />
      <HomeHeroBackground />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-8 py-6 lg:gap-10 lg:py-8">
        <div className="w-full px-4 lg:px-8">
          <HomeHeroPanel
            filter={filter}
            onFilterChange={setFilter}
            allCentres={allCentres}
          />
        </div>

        <CentreCarousel key={filter} centres={centres} filterKey={filter} />
      </div>
    </motion.div>
  );
}
