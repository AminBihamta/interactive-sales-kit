import type { Centre } from "@/lib/types";

interface CentreHeaderProps {
  centre: Centre;
}

export function CentreHeader({ centre }: CentreHeaderProps) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-brand-primary md:text-4xl">
          {centre.name}
        </h1>
      </div>
    </header>
  );
}
