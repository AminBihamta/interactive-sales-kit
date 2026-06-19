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
          ? "flex min-h-0 flex-1 flex-col overflow-hidden"
          : "mx-auto max-w-5xl px-6 py-8",
      )}
    >
      {children}
    </main>
  );
}
