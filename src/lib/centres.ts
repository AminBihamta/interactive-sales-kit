import centresData from "../../content/centres.json";
import curriculumData from "../../content/curriculum.json";
import schedulesData from "../../content/schedules.json";
import feesData from "../../content/fees.json";
import programmesData from "../../content/programmes.json";
import type {
  Centre,
  CurriculumContent,
  CentreFees,
  ProgrammesContent,
  ScheduleContent,
  SchedulesContent,
  ProgrammeScheduleKey,
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
