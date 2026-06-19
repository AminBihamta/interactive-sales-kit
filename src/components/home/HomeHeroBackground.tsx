"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const ENABLE_HERO_3D = true;

const HomeHeroBackgroundCanvas = dynamic(
  () => import("./HomeHeroBackgroundCanvas"),
  { ssr: false },
);

function StaticFallback() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-40"
      style={{
        background:
          "radial-gradient(ellipse at 30% 40%, rgba(78,115,138,0.35) 0%, transparent 60%), url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

export function HomeHeroBackground() {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ENABLE_HERO_3D || reducedMotion) {
    return <StaticFallback />;
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      <HomeHeroBackgroundCanvas />
    </div>
  );
}
