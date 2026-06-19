"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";

type TransitionPhase = "idle" | "covering" | "navigating" | "revealing";
export type TransitionVariant = "journey" | "centre-entry";

interface CircleOrigin {
  x: number;
  y: number;
}

interface JourneyTransitionContextValue {
  start: (
    href: string,
    origin?: CircleOrigin,
    variant?: TransitionVariant,
  ) => void;
  isTransitioning: boolean;
}

const JourneyTransitionContext =
  createContext<JourneyTransitionContextValue | null>(null);

export function useJourneyTransition() {
  const ctx = useContext(JourneyTransitionContext);
  if (!ctx) {
    throw new Error(
      "useJourneyTransition must be used within a JourneyTransitionProvider",
    );
  }
  return ctx;
}

function circleClip(origin: CircleOrigin, radius: string) {
  return `circle(${radius} at ${origin.x}px ${origin.y}px)`;
}

const COVER_DURATION = 1.1;
const REVEAL_DURATION = 1;
const LOGO_IN_DELAY = 0.65;
const LOGO_IN_DURATION = 0.55;
const LOGO_OUT_DURATION = 0.65;

export function JourneyTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [origin, setOrigin] = useState<CircleOrigin | null>(null);
  const [variant, setVariant] = useState<TransitionVariant>("journey");
  const targetHref = useRef<string | null>(null);

  const start = useCallback(
    (
      href: string,
      clickOrigin?: CircleOrigin,
      transitionVariant: TransitionVariant = "journey",
    ) => {
      if (phase !== "idle") return;

      if (reducedMotion || !clickOrigin) {
        router.push(href);
        return;
      }

      setOrigin(clickOrigin);
      setVariant(transitionVariant);
      targetHref.current = href;
      setPhase("covering");
    },
    [phase, reducedMotion, router],
  );

  useEffect(() => {
    if (phase === "navigating" && pathname === targetHref.current) {
      setPhase("revealing");
    }
  }, [phase, pathname]);

  const isTransitioning = phase !== "idle";

  const zeroClip = origin ? circleClip(origin, "0%") : undefined;
  const fullClip = origin ? circleClip(origin, "150vmax") : undefined;
  const isCentreEntry = variant === "centre-entry";

  return (
    <JourneyTransitionContext.Provider value={{ start, isTransitioning }}>
      {children}

      <AnimatePresence>
        {isTransitioning && origin && zeroClip && fullClip && (
          <>
            <motion.div
              key="journey-circle-overlay"
              aria-hidden="true"
              className={cn(
                "pointer-events-none fixed inset-0 z-[60]",
                isCentreEntry ? "bg-white" : "bg-brand-primary",
              )}
              initial={{ clipPath: zeroClip }}
              animate={{
                clipPath: phase === "revealing" ? zeroClip : fullClip,
              }}
              transition={
                phase === "revealing"
                  ? { duration: REVEAL_DURATION, ease: [0.4, 0, 0.2, 1] }
                  : { duration: COVER_DURATION, ease: [0.5, 0, 0.75, 0] }
              }
              onAnimationComplete={() => {
                if (phase === "covering") {
                  if (targetHref.current) {
                    router.push(targetHref.current);
                  }
                  setPhase("navigating");
                } else if (phase === "revealing") {
                  setPhase("idle");
                  setOrigin(null);
                  setVariant("journey");
                  targetHref.current = null;
                }
              }}
            />
            <motion.div
              key="journey-circle-logo"
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-[61] flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{
                opacity: phase === "revealing" ? 0 : 1,
                scale: phase === "revealing" ? 1.04 : 1,
              }}
              transition={
                phase === "revealing"
                  ? { duration: LOGO_OUT_DURATION, ease: [0.4, 0, 0.2, 1] }
                  : {
                      duration: LOGO_IN_DURATION,
                      delay: LOGO_IN_DELAY,
                      ease: [0.22, 1, 0.36, 1],
                    }
              }
            >
              <BrandLogo
                variant={isCentreEntry ? "red" : "white"}
                priority
                className={
                  isCentreEntry ? "h-10 w-auto md:h-12" : "h-14 w-auto md:h-16"
                }
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </JourneyTransitionContext.Provider>
  );
}
