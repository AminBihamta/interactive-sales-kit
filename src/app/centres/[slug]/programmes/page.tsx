import { notFound } from "next/navigation";
import { getCentreBySlug, getProgrammes } from "@/lib/centres";
import { CentreHeader } from "@/components/journey/CentreHeader";
import { AgeMatcher } from "@/components/programmes/AgeMatcher";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProgrammesPage({ params }: PageProps) {
  const { slug } = await params;
  const centre = getCentreBySlug(slug);

  if (!centre) {
    notFound();
  }

  const programmes = getProgrammes();

  return (
    <div>
      <CentreHeader centre={centre} />
      <AgeMatcher centre={centre} programmes={programmes} />
    </div>
  );
}
