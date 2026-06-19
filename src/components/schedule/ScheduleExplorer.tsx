"use client";

import { useMemo, useState } from "react";
import { Baby, GraduationCap } from "lucide-react";
import { DayTimeline } from "@/components/schedule/DayTimeline";
import { getScheduleForProgramme } from "@/lib/centres";
import type {
  Centre,
  ProgrammeScheduleKey,
  ProgrammesContent,
  SchedulesContent,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface ScheduleExplorerProps {
  centre: Centre;
  schedules: SchedulesContent;
  programmes: ProgrammesContent;
}

const PROGRAMME_OPTIONS: {
  key: ProgrammeScheduleKey;
  icon: typeof Baby;
}[] = [
  { key: "playgroup", icon: Baby },
  { key: "junior", icon: GraduationCap },
];

export function ScheduleExplorer({
  centre,
  schedules,
  programmes,
}: ScheduleExplorerProps) {
  const availableProgrammes = useMemo(
    () =>
      PROGRAMME_OPTIONS.filter(({ key }) => centre.programmes[key].available),
    [centre],
  );

  const [activeProgramme, setActiveProgramme] = useState<ProgrammeScheduleKey>(
    () => availableProgrammes[0]?.key ?? "junior",
  );

  const activeSchedule = getScheduleForProgramme(schedules, activeProgramme);
  const showToggle = availableProgrammes.length > 1;

  return (
    <div className="space-y-6">
      {showToggle && (
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Programme schedule"
        >
          {availableProgrammes.map(({ key, icon: Icon }) => {
            const isActive = key === activeProgramme;
            const label = programmes[key].title;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveProgramme(key)}
                className={cn(
                  "inline-flex min-h-11 flex-1 basis-[calc(50%-0.25rem)] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all sm:flex-none sm:basis-auto",
                  isActive
                    ? "bg-brand-secondary text-white shadow-md"
                    : "bg-surface text-foreground hover:bg-surface/80",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </div>
      )}

      <DayTimeline key={activeProgramme} schedule={activeSchedule} />
    </div>
  );
}
