import { notFound } from "next/navigation";
import { getCentreBySlug, getFeesForCentre } from "@/lib/centres";
import { CentreHeader } from "@/components/journey/CentreHeader";
import { FeeExplorer } from "@/components/fees/FeeExplorer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function FeesPage({ params }: PageProps) {
  const { slug } = await params;
  const centre = getCentreBySlug(slug);

  if (!centre) {
    notFound();
  }

  const fees = getFeesForCentre(slug);

  return (
    <div>
      <CentreHeader centre={centre} />
      <h2 className="mb-6 text-2xl font-bold">Fee Structure</h2>
      <FeeExplorer centre={centre} fees={fees} />
    </div>
  );
}
