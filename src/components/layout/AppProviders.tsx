"use client";

import { JourneyTransitionProvider } from "@/components/journey/JourneyTransition";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <JourneyTransitionProvider>{children}</JourneyTransitionProvider>;
}
