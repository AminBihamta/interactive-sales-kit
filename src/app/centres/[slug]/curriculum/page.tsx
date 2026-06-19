import { notFound } from "next/navigation";
import { getCentreBySlug, getCurriculum } from "@/lib/centres";
import { CentreHeader } from "@/components/journey/CentreHeader";
import { SteamPillars } from "@/components/curriculum/SteamPillars";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CurriculumPage({ params }: PageProps) {
  const { slug } = await params;
  const centre = getCentreBySlug(slug);

  if (!centre) {
    notFound();
  }

  const curriculum = getCurriculum();

  return (
    <div>
      <CentreHeader centre={centre} />
      <SteamPillars curriculum={curriculum} />
    </div>
  );
}
