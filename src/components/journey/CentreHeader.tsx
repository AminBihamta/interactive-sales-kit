"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import type { Centre } from "@/lib/types";

interface CentreHeaderProps {
  centre: Centre;
}

export function CentreHeader({ centre }: CentreHeaderProps) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <Link
          href="/"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-brand-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          All centres
        </Link>
        <div className="mb-3">
          <BrandLogo variant="red" className="h-8 md:h-9" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {centre.name}
        </h1>
      </div>
    </header>
  );
}
