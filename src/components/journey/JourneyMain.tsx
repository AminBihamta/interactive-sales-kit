"use client";

import { usePathname } from "next/navigation";
import { resolveStepFromPath } from "@/lib/journey";
import { cn } from "@/lib/utils";

interface JourneyMainProps {
  children: React.ReactNode;
}

export function JourneyMain({ children }: JourneyMainProps) {
  const pathname = usePathname();
  const isHome = resolveStepFromPath(pathname) === "home";

  return (
    <main
      className={cn(
        isHome
          ? "h-full min-h-0 overflow-hidden"
          : "mx-auto max-w-5xl px-6 py-8",
      )}
    >
      {children}
    </main>
  );
}
