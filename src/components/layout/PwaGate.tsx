"use client";

import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import {
  isIosDevice,
  isStandalonePwa,
  shouldRequirePwaInstall,
} from "@/lib/pwa";

interface PwaGateProps {
  children: React.ReactNode;
}

export function PwaGate({ children }: PwaGateProps) {
  const [access, setAccess] = useState<"checking" | "allowed" | "blocked">(
    "checking",
  );
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const updateAccess = () => {
      if (!shouldRequirePwaInstall()) {
        setAccess("allowed");
        return;
      }

      setAccess(isStandalonePwa() ? "allowed" : "blocked");
    };

    setIsIos(isIosDevice());
    updateAccess();

    const mediaQueries = [
      ...["standalone", "fullscreen", "minimal-ui"].map((mode) =>
        window.matchMedia(`(display-mode: ${mode})`),
      ),
      window.matchMedia(
        "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
      ),
      window.matchMedia("(max-width: 1024px)"),
      window.matchMedia("(pointer: coarse)"),
    ];

    mediaQueries.forEach((mq) => mq.addEventListener("change", updateAccess));
    window.addEventListener("appinstalled", updateAccess);
    window.addEventListener("resize", updateAccess);

    return () => {
      mediaQueries.forEach((mq) =>
        mq.removeEventListener("change", updateAccess),
      );
      window.removeEventListener("appinstalled", updateAccess);
      window.removeEventListener("resize", updateAccess);
    };
  }, []);

  if (access === "checking") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-brand-primary">
        <BrandLogo variant="white" priority className="h-12 w-auto md:h-14" />
      </div>
    );
  }

  if (access === "blocked") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-brand-primary px-8 text-center text-white">
        <BrandLogo variant="white" priority className="h-12 w-auto md:h-14" />
        <h1 className="mt-8 text-2xl font-bold md:text-3xl">
          Install the Sales Kit
        </h1>
        <p className="mt-3 max-w-md text-base opacity-90 md:text-lg">
          This app is designed for installed tablet use. Open it from your home
          screen after adding it to this device.
        </p>

        <div className="mt-8 w-full max-w-sm rounded-2xl bg-white/10 p-6 text-left">
          {isIos ? (
            <>
              <div className="flex items-start gap-3">
                <Share className="mt-0.5 size-5 shrink-0" aria-hidden />
                <div>
                  <p className="font-semibold">On iPad or iPhone</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm opacity-90">
                    <li>Tap the Share button in Safari</li>
                    <li>Choose &ldquo;Add to Home Screen&rdquo;</li>
                    <li>Open TCH Sales Kit from your home screen</li>
                  </ol>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <Download className="mt-0.5 size-5 shrink-0" aria-hidden />
                <div>
                  <p className="font-semibold">On Android or Chrome</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm opacity-90">
                    <li>Open the browser menu</li>
                    <li>Tap &ldquo;Install app&rdquo; or &ldquo;Add to Home screen&rdquo;</li>
                    <li>Open TCH Sales Kit from your home screen</li>
                  </ol>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return children;
}
