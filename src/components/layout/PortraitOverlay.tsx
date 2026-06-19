"use client";

import { useEffect, useState } from "react";
import { RotateCw } from "lucide-react";

export function PortraitOverlay() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-primary px-8 text-center text-white">
      <RotateCw className="size-16 animate-pulse" />
      <h2 className="mt-6 text-2xl font-bold">Rotate your device</h2>
      <p className="mt-3 max-w-sm opacity-90">
        This sales kit is designed for landscape tablet use. Please rotate your
        device for the best experience.
      </p>
    </div>
  );
}
