"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Baby, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getAgeInMonths,
  getBirthDateBounds,
  getProgrammeForAge,
} from "@/lib/centres";
import type { Centre, ProgrammesContent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BirthDateCalendar } from "./BirthDateCalendar";

interface AgeMatcherProps {
  centre: Centre;
  programmes: ProgrammesContent;
}

function formatAge(months: number): string {
  if (months < 12) return `${months} months`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return `${years} year${years > 1 ? "s" : ""}`;
  return `${years}y ${rem}m`;
}

function defaultBirthDate(maxDate: Date) {
  const date = new Date(maxDate);
  date.setFullYear(date.getFullYear() - 2);
  return date;
}

export function AgeMatcher({ centre, programmes }: AgeMatcherProps) {
  const { minDate, maxDate } = useMemo(() => getBirthDateBounds(), []);
  const [birthDate, setBirthDate] = useState(() => defaultBirthDate(maxDate));

  const ageMonths = getAgeInMonths(birthDate);
  const match = getProgrammeForAge(centre, ageMonths);
  const programmeList = [programmes.playgroup, programmes.junior];

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(280px,38%)_1fr] lg:gap-8">
      <BirthDateCalendar
        value={birthDate}
        onChange={setBirthDate}
        minDate={minDate}
        maxDate={maxDate}
        ageLabel={formatAge(ageMonths)}
      />

      <div className="flex min-h-0 flex-col gap-4">
        <div className="flex flex-col gap-4">
          {programmeList.map((programme) => {
            const isPlaygroup = programme.id === "playgroup";
            const available = isPlaygroup
              ? centre.programmes.playgroup.available
              : centre.programmes.junior.available;
            const isHighlighted = match === programme.id;
            const Icon = isPlaygroup ? Baby : GraduationCap;

            return (
              <motion.div
                key={programme.id}
                layout
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "flex flex-col rounded-2xl px-6 py-6 transition-colors lg:rounded-3xl",
                  isHighlighted
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/25"
                    : "border border-border bg-white",
                  !available && "opacity-50",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Icon
                      className={cn(
                        "size-8 shrink-0",
                        isHighlighted
                          ? "text-white"
                          : isPlaygroup
                            ? "text-brand-primary"
                            : "text-brand-secondary",
                      )}
                    />
                    <div>
                      <h4
                        className={cn(
                          "text-xl font-bold",
                          isHighlighted ? "text-white" : "text-foreground",
                        )}
                      >
                        {programme.title}
                      </h4>
                      <p
                        className={cn(
                          "text-sm",
                          isHighlighted ? "text-white/75" : "text-muted-foreground",
                        )}
                      >
                        {programme.subtitle}
                      </p>
                    </div>
                  </div>

                  {available && (
                    <Badge
                      className={cn(
                        "shrink-0",
                        isHighlighted
                          ? "border-transparent bg-white/20 text-white hover:bg-white/20"
                          : "bg-brand-primary text-white",
                      )}
                    >
                      {isPlaygroup
                        ? centre.programmes.playgroup.ageRange
                        : centre.programmes.junior.ageRange}
                    </Badge>
                  )}
                </div>

                {!available ? (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "mt-4 w-fit",
                      isHighlighted && "bg-white/20 text-white",
                    )}
                  >
                    Not available at this centre
                  </Badge>
                ) : (
                  <>
                    <p
                      className={cn(
                        "mt-4 text-sm leading-relaxed",
                        isHighlighted ? "text-white/90" : "text-foreground",
                      )}
                    >
                      {isPlaygroup
                        ? centre.programmes.playgroup.description
                        : centre.programmes.junior.description}
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      {programme.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className={cn(
                            "flex items-start gap-2 text-sm",
                            isHighlighted
                              ? "text-white/85"
                              : "text-muted-foreground",
                          )}
                        >
                          <span
                            className={cn(
                              "mt-1.5 size-1.5 shrink-0 rounded-full",
                              isHighlighted
                                ? "bg-white"
                                : "bg-brand-secondary",
                            )}
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
