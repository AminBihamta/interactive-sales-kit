import { notFound } from "next/navigation";
import { getCentreBySlug, getScheduleExplorerContent } from "@/lib/centres";
import { CentreHeader } from "@/components/journey/CentreHeader";
import { ScheduleExplorer } from "@/components/schedule/ScheduleExplorer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SchedulePage({ params }: PageProps) {
  const { slug } = await params;
  const centre = getCentreBySlug(slug);

  if (!centre) {
    notFound();
  }

  const scheduleContent = getScheduleExplorerContent(slug, centre);

  return (
    <div>
      <CentreHeader centre={centre} />
      <h2 className="mb-6 text-2xl font-bold">{scheduleContent.title}</h2>
      <ScheduleExplorer scheduleContent={scheduleContent} />
    </div>
  );
}
