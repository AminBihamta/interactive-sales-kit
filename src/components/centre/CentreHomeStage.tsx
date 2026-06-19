"use client";

import { useEffect, useState } from "react";
import type { Centre } from "@/lib/types";
import { CentreHeroImage } from "./CentreHeroImage";
import { CentreHomePanel } from "./CentreHomePanel";

interface CentreHomeStageProps {
  centre: Centre;
}

export function CentreHomeStage({ centre }: CentreHomeStageProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[58%_42%]">
      <div className="relative min-h-[32vh] lg:min-h-0">
        <CentreHeroImage centre={centre} ready={ready} />
      </div>
      <div className="min-h-0 p-4 pb-0 lg:pt-4 lg:pr-6 lg:pl-2 lg:pb-0">
        <CentreHomePanel centre={centre} ready={ready} />
      </div>
    </div>
  );
}
