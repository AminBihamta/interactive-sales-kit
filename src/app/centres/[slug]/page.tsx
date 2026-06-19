import { notFound } from "next/navigation";
import { getCentreBySlug } from "@/lib/centres";
import { CentreHomeStage } from "@/components/centre/CentreHomeStage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CentreHomePage({ params }: PageProps) {
  const { slug } = await params;
  const centre = getCentreBySlug(slug);

  if (!centre) {
    notFound();
  }

  return <CentreHomeStage centre={centre} />;
}
