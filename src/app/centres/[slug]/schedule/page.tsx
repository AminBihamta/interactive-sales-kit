import { notFound } from "next/navigation";
import { getCentreBySlug, getProgrammes, getSchedules } from "@/lib/centres";
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

  const schedules = getSchedules();
  const programmes = getProgrammes();

  return (
    <div>
      <CentreHeader centre={centre} />
      <h2 className="mb-6 text-2xl font-bold">{schedules.title}</h2>
      <ScheduleExplorer
        centre={centre}
        schedules={schedules}
        programmes={programmes}
      />
    </div>
  );
}
