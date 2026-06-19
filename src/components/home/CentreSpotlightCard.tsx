"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Centre } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CentreSpotlightCardProps {
  centre: Centre;
  isActive: boolean;
  index: number;
  onSelect?: (index: number) => void;
}

export function CentreSpotlightCard({
  centre,
  isActive,
  index,
  onSelect,
}: CentreSpotlightCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{
        scale: isActive ? 1 : 0.94,
        opacity: isActive ? 1 : 0.55,
        filter: isActive ? "brightness(1)" : "brightness(0.9)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="h-full w-full min-w-0"
      aria-current={isActive ? "true" : undefined}
    >
      <Link
        href={`/centres/${centre.slug}`}
        onClick={(e) => {
          if (!isActive) {
            e.preventDefault();
            onSelect?.(index);
          }
        }}
        className={cn(
          "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-black shadow-xl",
          !isActive && "cursor-pointer",
        )}
        tabIndex={isActive ? 0 : -1}
        aria-label={!isActive ? `Select ${centre.name}` : undefined}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isActive && !reducedMotion ? 1.06 : 1 }}
            transition={
              isActive && !reducedMotion
                ? {
                    duration: 8,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "reverse",
                  }
                : { duration: 0.3 }
            }
          >
            <Image
              src={centre.image}
              alt={centre.name}
              fill
              className="object-cover"
              sizes="30vw"
              priority={index < 5}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-brand-secondary backdrop-blur">
            {centre.region}
          </span>

          {isActive && (
            <span className="absolute bottom-2 right-2 flex size-9 items-center justify-center rounded-full bg-brand-primary text-white shadow-lg transition-transform group-hover:scale-110">
              <ArrowUpRight className="size-4" />
            </span>
          )}

          {!isActive && (
            <div className="absolute inset-x-0 bottom-0 p-2">
              <p className="line-clamp-2 text-center text-xs font-bold leading-tight text-white">
                {centre.name}
              </p>
            </div>
          )}
        </div>

        {isActive && (
          <div className="relative shrink-0 bg-white px-3 py-3">
            <h2 className="text-lg font-bold text-brand-primary lg:text-xl">
              {centre.name}
            </h2>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
              {centre.heroTagline}
            </p>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-secondary">
              <MapPin className="size-3 shrink-0" />
              <span className="line-clamp-1">{centre.ageRange}</span>
            </div>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
