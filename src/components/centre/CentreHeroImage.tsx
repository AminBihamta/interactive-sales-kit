"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { centreHeroReveal } from "@/lib/animations";
import type { Centre } from "@/lib/types";
import { CentreBackNav } from "./CentreBackNav";

interface CentreHeroImageProps {
  centre: Centre;
  ready?: boolean;
}

export function CentreHeroImage({ centre, ready = true }: CentreHeroImageProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={centreHeroReveal}
      initial={ready && !reducedMotion ? "initial" : false}
      animate={ready && !reducedMotion ? "animate" : false}
      className="absolute inset-0 overflow-hidden bg-black"
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: ready && !reducedMotion ? 1.06 : 1 }}
        transition={
          ready && !reducedMotion
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
          alt={`${centre.name} centre exterior`}
          fill
          className="object-cover"
          sizes="58vw"
          priority
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/15" />

      <div className="absolute left-4 top-4 z-10 lg:left-6 lg:top-6">
        <CentreBackNav />
      </div>

      <span className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-secondary backdrop-blur lg:right-6 lg:top-6">
        {centre.region}
      </span>
    </motion.div>
  );
}
