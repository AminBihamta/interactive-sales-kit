import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  /** Render inside a brand-primary container (for use on light backgrounds). */
  framed?: boolean;
  priority?: boolean;
  variant?: "white" | "red";
}

export function BrandLogo({
  className,
  framed = false,
  priority = false,
  variant = "white",
}: BrandLogoProps) {
  const isRed = variant === "red";

  const logo = (
    <Image
      src={isRed ? "/images/red-logo.svg" : "/images/logo-white.svg"}
      alt="The children's house montessori by Busy Bees"
      width={isRed ? 149 : 251}
      height={isRed ? 60 : 91}
      priority={priority}
      className={cn(isRed ? "h-10 w-auto md:h-12" : "h-12 w-auto md:h-16", className)}
    />
  );

  if (framed && !isRed) {
    return (
      <div className="inline-flex rounded-2xl bg-brand-primary px-5 py-3 shadow-lg shadow-brand-primary/20">
        {logo}
      </div>
    );
  }

  return logo;
}
