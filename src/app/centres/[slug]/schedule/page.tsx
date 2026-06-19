import { notFound } from "next/navigation";
import { getCentreBySlug, getSchedule } from "@/lib/centres";
import { CentreHeader } from "@/components/journey/CentreHeader";
import { DayTimeline } from "@/components/schedule/DayTimeline";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SchedulePage({ params }: PageProps) {
  const { slug } = await params;
  const centre = getCentreBySlug(slug);

  if (!centre) {
    notFound();
  }

  const schedule = getSchedule();

  return (
    <div>
      <CentreHeader centre={centre} />
      <h2 className="mb-6 text-2xl font-bold">{schedule.title}</h2>
      <DayTimeline schedule={schedule} />
    </div>
  );
}
