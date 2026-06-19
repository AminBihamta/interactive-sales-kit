"use client";

import { useMemo, useState } from "react";
import { Baby, GraduationCap } from "lucide-react";
import { DayTimeline } from "@/components/schedule/DayTimeline";
import { getScheduleForOption } from "@/lib/centres";
import type { ScheduleExplorerContent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ScheduleExplorerProps {
  scheduleContent: ScheduleExplorerContent;
}

const PROGRAMME_ICONS: Record<string, typeof Baby> = {
  playgroup: Baby,
  junior: GraduationCap,
  "infant-pre-tots": Baby,
  toddler: Baby,
  nursery: GraduationCap,
  kindergarten: GraduationCap,
};

export function ScheduleExplorer({ scheduleContent }: ScheduleExplorerProps) {
  const programmes = scheduleContent.programmes;

  const [activeProgrammeId, setActiveProgrammeId] = useState(
    () => programmes[0]?.id ?? "",
  );

  const activeSchedule = useMemo(
    () => getScheduleForOption(scheduleContent, activeProgrammeId),
    [scheduleContent, activeProgrammeId],
  );

  const showToggle = programmes.length > 1;

  if (programmes.length === 0) return null;

  return (
    <div className="space-y-6">
      {showToggle && (
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Programme schedule"
        >
          {programmes.map(({ id, label }) => {
            const isActive = id === activeProgrammeId;
            const Icon = PROGRAMME_ICONS[id] ?? GraduationCap;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveProgrammeId(id)}
                className={cn(
                  "inline-flex min-h-11 flex-1 basis-[calc(50%-0.25rem)] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all lg:flex-none lg:basis-auto",
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

      <DayTimeline key={activeProgrammeId} schedule={activeSchedule} />
    </div>
  );
}
