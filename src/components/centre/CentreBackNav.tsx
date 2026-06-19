import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface CentreBackNavProps {
  className?: string;
  variant?: "light" | "dark";
}

export function CentreBackNav({
  className,
  variant = "light",
}: CentreBackNavProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold backdrop-blur transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        variant === "light"
          ? "bg-black/30 text-white hover:bg-black/45"
          : "text-brand-primary hover:bg-surface",
        className,
      )}
    >
      <ArrowLeft className="size-4" />
      All centres
    </Link>
  );
}
