export type Region = "KL" | "Selangor";

export interface ProgrammeOffering {
  available: boolean;
  ageRange: string;
  description: string;
}

export interface Centre {
  id: string;
  slug: string;
  name: string;
  region: Region;
  address: string;
  heroTagline: string;
  intro: string;
  ageRange: string;
  image: string;
  gallery: string[];
  programmes: {
    playgroup: ProgrammeOffering;
    junior: ProgrammeOffering;
  };
  playgroupMinAgeMonths: number;
  feesAvailable: boolean;
  usps: string[];
  websiteUrl: string;
}

export interface SteamPillar {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
}

export interface MontessoriArea {
  id: string;
  title: string;
  description: string;
}

export interface CurriculumContent {
  steamPillars: SteamPillar[];
  montessoriAreas: MontessoriArea[];
  intro: string;
}

export interface ScheduleBlock {
  id: string;
  time: string;
  title: string;
  description: string;
  icon: string;
}

export type ProgrammeScheduleKey = "playgroup" | "junior";

export interface ProgrammeSchedule {
  blocks: ScheduleBlock[];
}

export interface ScheduleContent {
  title: string;
  disclaimer: string;
  blocks: ScheduleBlock[];
}

export interface SchedulesContent {
  title: string;
  disclaimer: string;
  programmes: Record<ProgrammeScheduleKey, ProgrammeSchedule>;
}

export interface FeeTier {
  ageGroup: string;
  programmeType: "Half Day" | "Extended Day" | "Full Day";
  schoolHours: string;
  termFee: number;
  monthlyFee: number;
  deposit: number;
}

export interface OneTimeFees {
  registrationFee: number;
  annualResourceFee: number;
  bookStationeryUnder3: number;
  bookStationeryOver3: number;
  insurance: number;
}

export interface CentreFees {
  slug: string;
  available: boolean;
  oneTimeFees: OneTimeFees;
  tiers: FeeTier[];
  notes: string[];
}

export interface ProgrammeInfo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ageRanges: { label: string; range: string }[];
  ratios: { label: string; value: string }[];
  highlights: string[];
}

export interface ProgrammesContent {
  playgroup: ProgrammeInfo;
  junior: ProgrammeInfo;
}

export type JourneyStepId =
  | "home"
  | "curriculum"
  | "programmes"
  | "schedule"
  | "fees"
  | "register";

export interface JourneyStep {
  id: JourneyStepId;
  label: string;
  href: string;
}

export interface EnquiryFormData {
  parentName: string;
  mobileNumber: string;
  email: string;
  childName: string;
  childDob: string;
  programme: string;
  visitDay: string;
  visitTime: string;
  marketingConsent: boolean;
}
