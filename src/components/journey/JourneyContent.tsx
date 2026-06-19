"use client";

import { usePathname } from "next/navigation";
import { resolveStepFromPath } from "@/lib/journey";
import { cn } from "@/lib/utils";

interface JourneyContentProps {
  children: React.ReactNode;
}

export function JourneyContent({ children }: JourneyContentProps) {
  const pathname = usePathname();
  const isHome = resolveStepFromPath(pathname) === "home";

  return (
    <div className={cn(isHome ? "h-dvh overflow-hidden" : "min-h-dvh pb-journey")}>
      {children}
    </div>
  );
}
