import { notFound } from "next/navigation";
import { getAllCentres, getCentreBySlug } from "@/lib/centres";
import { JourneyShell } from "@/components/journey/JourneyShell";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCentres().map((centre) => ({ slug: centre.slug }));
}

export default async function CentreLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const centre = getCentreBySlug(slug);

  if (!centre) {
    notFound();
  }

  return <JourneyShell slug={slug}>{children}</JourneyShell>;
}
