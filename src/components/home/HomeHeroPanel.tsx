"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/layout/BrandLogo";
import type { Centre, Region } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "all" | Region;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All centres" },
  { id: "KL", label: "Kuala Lumpur" },
  { id: "Selangor", label: "Selangor" },
];

const headlineWords = ["Find", "your", "centre"];

interface HomeHeroPanelProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  allCentres: Centre[];
}

export function HomeHeroPanel({
  filter,
  onFilterChange,
  allCentres,
}: HomeHeroPanelProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <header className="relative w-full shrink-0">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className={ready ? "animate-hero-logo" : "opacity-0"}>
          <BrandLogo priority />
        </div>

        <h1
          className={`mt-4 whitespace-nowrap text-4xl font-bold leading-[1.05] tracking-tight text-white lg:mt-5 lg:text-5xl ${ready ? "animate-hero-headline" : "opacity-0"}`}
        >
          {headlineWords.map((word) => (
            <span
              key={word}
              className={`mr-2 inline-block ${word === "centre" ? "text-surface" : ""}`}
            >
              {word}
            </span>
          ))}
        </h1>

        <p
          className={`mt-3 text-sm leading-relaxed text-white/75 lg:text-base ${ready ? "animate-hero-stats" : "opacity-0"}`}
        >
          Est. 1986 · {allCentres.length} centres · 20,000+ children · 50+
          countries
        </p>

        <div
          className={`mt-5 flex flex-wrap justify-center gap-2 ${ready ? "animate-hero-filters" : "opacity-0"}`}
          role="group"
          aria-label="Filter centres by region"
        >
          {FILTERS.map((f) => {
            const isActive = filter === f.id;
            const count =
              f.id === "all"
                ? allCentres.length
                : allCentres.filter((c) => c.region === f.id).length;
            return (
              <Button
                key={f.id}
                type="button"
                variant="outline"
                aria-pressed={isActive}
                onClick={() => onFilterChange(f.id)}
                className={cn(
                  isActive
                    ? "border-white bg-white text-brand-primary hover:bg-white/90 hover:text-brand-primary"
                    : "border-white bg-transparent text-white hover:bg-white/10 hover:text-white",
                )}
              >
                {f.label}
                <Badge
                  className={cn(
                    isActive
                      ? "border-transparent bg-brand-primary/10 text-brand-primary"
                      : "border-transparent bg-white/15 text-white",
                  )}
                >
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export type { Filter };
