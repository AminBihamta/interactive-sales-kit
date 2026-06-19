import centresData from "../../content/centres.json";
import curriculumData from "../../content/curriculum.json";
import schedulesData from "../../content/schedules.json";
import centreSchedulesData from "../../content/centre-schedules.json";
import feesData from "../../content/fees.json";
import programmesData from "../../content/programmes.json";
import type {
  Centre,
  CurriculumContent,
  CentreFees,
  ProgrammesContent,
  ScheduleContent,
  SchedulesContent,
  ScheduleExplorerContent,
  ProgrammeScheduleKey,
  CentreSchedulesConfig,
} from "./types";

export function getAllCentres(): Centre[] {
  return centresData.centres as Centre[];
}

export function getCentreBySlug(slug: string): Centre | undefined {
  return getAllCentres().find((centre) => centre.slug === slug);
}

export function getCentresByRegion(region: Centre["region"]): Centre[] {
  return getAllCentres().filter((centre) => centre.region === region);
}

export function getCurriculum(): CurriculumContent {
  return curriculumData as CurriculumContent;
}

export function getSchedules(): SchedulesContent {
  return schedulesData as SchedulesContent;
}

export function getScheduleForProgramme(
  schedules: SchedulesContent,
  programme: ProgrammeScheduleKey,
): ScheduleContent {
  return {
    title: schedules.title,
    disclaimer: schedules.disclaimer,
    blocks: schedules.programmes[programme].blocks,
  };
}

export function getScheduleExplorerContent(
  slug: string,
  centre: Centre,
): ScheduleExplorerContent {
  const centreConfig = (
    centreSchedulesData.centres as CentreSchedulesConfig[]
  ).find((entry) => entry.slug === slug);

  if (centreConfig) {
    const defaultSchedules = getSchedules();
    return {
      title: centreConfig.title ?? defaultSchedules.title,
      disclaimer: centreConfig.disclaimer ?? defaultSchedules.disclaimer,
      programmes: centreConfig.programmes,
    };
  }

  const schedules = getSchedules();
  const programmes = getProgrammes();

  const options: ScheduleExplorerContent["programmes"] = [];

  if (centre.programmes.playgroup.available) {
    options.push({
      id: "playgroup",
      label: programmes.playgroup.title,
      blocks: schedules.programmes.playgroup.blocks,
    });
  }

  if (centre.programmes.junior.available) {
    options.push({
      id: "junior",
      label: programmes.junior.title,
      blocks: schedules.programmes.junior.blocks,
    });
  }

  return {
    title: schedules.title,
    disclaimer: schedules.disclaimer,
    programmes: options,
  };
}

export function getScheduleForOption(
  content: ScheduleExplorerContent,
  programmeId: string,
): ScheduleContent {
  const programme = content.programmes.find((entry) => entry.id === programmeId);

  return {
    title: content.title,
    disclaimer: content.disclaimer,
    blocks: programme?.blocks ?? [],
  };
}

export function getProgrammes(): ProgrammesContent {
  return programmesData as ProgrammesContent;
}

export function getFeesForCentre(slug: string): CentreFees | undefined {
  return (feesData.centres as CentreFees[]).find((fee) => fee.slug === slug);
}

export function getProgrammeForAge(
  centre: Centre,
  ageMonths: number,
): "playgroup" | "junior" | null {
  if (ageMonths >= 31 && centre.programmes.junior.available) {
    return "junior";
  }
  if (
    ageMonths >= centre.playgroupMinAgeMonths &&
    centre.programmes.playgroup.available
  ) {
    return "playgroup";
  }

  // Below minimum ages — highlight the entry programme (lowest from age).
  if (centre.programmes.playgroup.available) {
    return "playgroup";
  }
  if (centre.programmes.junior.available) {
    return "junior";
  }
  return null;
}

export function getAgeInMonths(
  birthDate: Date,
  referenceDate: Date = new Date(),
): number {
  let months =
    (referenceDate.getFullYear() - birthDate.getFullYear()) * 12 +
    (referenceDate.getMonth() - birthDate.getMonth());

  if (referenceDate.getDate() < birthDate.getDate()) {
    months -= 1;
  }

  return Math.max(0, months);
}

export function getBirthDateBounds(referenceDate: Date = new Date()) {
  const maxDate = new Date(referenceDate);
  const minDate = new Date(referenceDate);
  minDate.setMonth(minDate.getMonth() - 72);
  maxDate.setMonth(maxDate.getMonth() - 2);
  return { minDate, maxDate };
}
