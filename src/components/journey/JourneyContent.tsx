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
    <div
      className={cn(
        isHome
          ? "flex min-h-dvh flex-col overflow-hidden"
          : "max-h-[calc(100dvh-40px)] overflow-y-auto pb-journey",
      )}
    >
      {children}
    </div>
  );
}
