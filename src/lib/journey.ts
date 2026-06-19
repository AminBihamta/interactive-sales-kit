import type { JourneyStep, JourneyStepId } from "./types";

export const REGISTER_STEP_ENABLED = false;

export const JOURNEY_STEPS: JourneyStep[] = [
  { id: "home", label: "Home", href: "" },
  { id: "curriculum", label: "Curriculum", href: "curriculum" },
  { id: "programmes", label: "Programmes", href: "programmes" },
  { id: "schedule", label: "Schedule", href: "schedule" },
  { id: "fees", label: "Fees", href: "fees" },
  ...(REGISTER_STEP_ENABLED
    ? [{ id: "register" as const, label: "Register", href: "register" }]
    : []),
];

export function getJourneyHref(slug: string, step: JourneyStep): string {
  const base = `/centres/${slug}`;
  return step.href ? `${base}/${step.href}` : base;
}

export function getStepIndex(stepId: JourneyStepId): number {
  return JOURNEY_STEPS.findIndex((step) => step.id === stepId);
}

export function getAdjacentStep(
  stepId: JourneyStepId,
  direction: "prev" | "next",
): JourneyStep | null {
  const index = getStepIndex(stepId);
  const nextIndex = direction === "next" ? index + 1 : index - 1;
  return JOURNEY_STEPS[nextIndex] ?? null;
}

export function resolveStepFromPath(pathname: string): JourneyStepId {
  const segment = pathname.split("/").filter(Boolean).pop();
  const match = JOURNEY_STEPS.find((step) => step.href === segment);
  return match?.id ?? "home";
}
