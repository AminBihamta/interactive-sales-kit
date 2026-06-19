import Link from "next/link";
import { Baby, GraduationCap } from "lucide-react";
import type { Centre } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CentreProgrammeChipsProps {
  centre: Centre;
  className?: string;
}

const PROGRAMME_CONFIG = [
  {
    key: "playgroup" as const,
    label: "Playgroup",
    icon: Baby,
  },
  {
    key: "junior" as const,
    label: "Junior",
    icon: GraduationCap,
  },
] as const;

export function CentreProgrammeChips({
  centre,
  className,
}: CentreProgrammeChipsProps) {
  const available = PROGRAMME_CONFIG.filter(
    ({ key }) => centre.programmes[key].available,
  );

  if (available.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {available.map(({ key, label, icon: Icon }) => {
        const programme = centre.programmes[key];
        return (
          <Link
            key={key}
            href={`/centres/${centre.slug}/programmes`}
            className="group flex min-w-0 flex-1 basis-[calc(50%-0.25rem)] items-center gap-2 rounded-xl border border-brand-secondary/15 bg-surface px-3 py-2.5 transition-colors hover:border-brand-secondary/40 hover:bg-white"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-secondary/10 text-brand-secondary transition-colors group-hover:bg-brand-secondary group-hover:text-white">
              <Icon className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold text-brand-primary">
                {label}
              </span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {programme.ageRange}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
