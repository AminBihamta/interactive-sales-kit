"use client";

import { ProgressNav } from "./ProgressNav";
import { SwipeNavigation } from "./SwipeNavigation";
import { JourneyMain } from "./JourneyMain";
import { JourneyContent } from "./JourneyContent";
import { JourneyTransitionProvider } from "./JourneyTransition";

interface JourneyShellProps {
  slug: string;
  children: React.ReactNode;
}

export function JourneyShell({ slug, children }: JourneyShellProps) {
  return (
    <JourneyTransitionProvider>
      <SwipeNavigation slug={slug}>
        <JourneyContent>
          <JourneyMain>{children}</JourneyMain>
        </JourneyContent>
        <ProgressNav slug={slug} />
      </SwipeNavigation>
    </JourneyTransitionProvider>
  );
}
