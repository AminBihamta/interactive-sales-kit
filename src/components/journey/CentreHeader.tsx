import type { Centre } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CentreHeaderProps {
  centre: Centre;
  align?: "left" | "center";
}

export function CentreHeader({ centre, align = "left" }: CentreHeaderProps) {
  return (
    <header
      className={cn(
        "mb-6 flex items-start gap-4",
        align === "center" ? "justify-center text-center" : "justify-between",
      )}
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-brand-primary md:text-4xl">
          {centre.name}
        </h1>
      </div>
    </header>
  );
}
