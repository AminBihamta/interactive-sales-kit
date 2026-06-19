"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Step = "year" | "month" | "day";

interface BirthDateCalendarProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate: Date;
  maxDate: Date;
  ageLabel: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MONTH_LABELS = Array.from({ length: 12 }, (_, month) =>
  new Date(2024, month, 1).toLocaleDateString("en-MY", { month: "short" }),
);

const MONTH_LABELS_FULL = Array.from({ length: 12 }, (_, month) =>
  new Date(2024, month, 1).toLocaleDateString("en-MY", { month: "long" }),
);

const STEP_SUBTITLES: Record<Step, string> = {
  year: "Start by choosing the birth year",
  month: "Now pick the birth month",
  day: "Finally, select the day",
};

const breadcrumbStepClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-center font-semibold transition-colors hover:bg-white";

const selectionTileClass =
  "w-full rounded-lg border border-border bg-white py-3 text-center text-lg font-semibold text-foreground transition-colors hover:bg-brand-primary/10";

const selectionTileSelectedClass = "border-brand-primary text-brand-primary";

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isWithinRange(date: Date, min: Date, max: Date) {
  const time = date.getTime();
  return time >= min.getTime() && time <= max.getTime();
}

function isMonthInRange(year: number, month: number, min: Date, max: Date) {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  return monthEnd >= min && monthStart <= max;
}

function isYearInRange(year: number, min: Date, max: Date) {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  return yearEnd >= min && yearStart <= max;
}

export function BirthDateCalendar({
  value,
  onChange,
  minDate,
  maxDate,
  ageLabel,
}: BirthDateCalendarProps) {
  const minYear = minDate.getFullYear();
  const maxYear = maxDate.getFullYear();

  const [step, setStep] = useState<Step>("year");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const years = useMemo(() => {
    const list: number[] = [];
    for (let year = minYear; year <= maxYear; year += 1) {
      if (isYearInRange(year, minDate, maxDate)) {
        list.push(year);
      }
    }
    return list;
  }, [minYear, maxYear, minDate, maxDate]);

  const days = useMemo(() => {
    if (selectedYear === null || selectedMonth === null) return [];

    const leadingEmpty = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < leadingEmpty; i += 1) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(selectedYear, selectedMonth, day));
    }
    return cells;
  }, [selectedYear, selectedMonth]);

  const goToStep = (target: Step) => {
    if (target === "year") {
      setStep("year");
      return;
    }
    if (target === "month" && selectedYear !== null) {
      setStep("month");
      return;
    }
    if (target === "day" && selectedYear !== null && selectedMonth !== null) {
      setStep("day");
    }
  };

  const selectYear = (year: number) => {
    setSelectedYear(year);
    setSelectedMonth(null);
    setStep("month");
  };

  const selectMonth = (month: number) => {
    setSelectedMonth(month);
    setStep("day");
  };

  const selectDay = (day: Date) => {
    onChange(day);
  };

  return (
    <div className="flex h-fit w-full flex-col self-start rounded-2xl bg-surface p-6 lg:rounded-3xl">
      <h3 className="text-lg font-semibold text-foreground">
        When was your child born?
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{STEP_SUBTITLES[step]}</p>

      <div className="mt-6 w-full">
        <nav
          aria-label="Birth date selection progress"
          className="flex min-w-0 flex-col gap-1 text-sm"
        >
          {step === "year" ? (
            <div className={cn(breadcrumbStepClass, "text-brand-primary")}>
              <span className="block text-center">Child&apos;s Year of Birth</span>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {years.map((year) => {
                  const isSelected = selectedYear === year;

                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => selectYear(year)}
                      className={cn(
                        selectionTileClass,
                        isSelected && selectionTileSelectedClass,
                      )}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => goToStep("year")}
              className={cn(breadcrumbStepClass, "text-foreground")}
            >
              {selectedYear ?? "Year"}
            </button>
          )}

          {(step === "month" || step === "day") && selectedYear !== null && (
            step === "month" ? (
              <div className={cn(breadcrumbStepClass, "text-brand-primary")}>
                <span className="block text-center">Child&apos;s Month of Birth</span>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {MONTH_LABELS.map((label, month) => {
                    const enabled = isMonthInRange(
                      selectedYear,
                      month,
                      minDate,
                      maxDate,
                    );
                    const isSelected = selectedMonth === month;

                    return (
                      <button
                        key={label}
                        type="button"
                        disabled={!enabled}
                        onClick={() => selectMonth(month)}
                        className={cn(
                          selectionTileClass,
                          "text-base",
                          isSelected && selectionTileSelectedClass,
                          !enabled &&
                            "cursor-not-allowed text-muted-foreground/35 hover:bg-white",
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => goToStep("month")}
                className={cn(breadcrumbStepClass, "text-center text-foreground")}
              >
                {selectedMonth !== null
                  ? MONTH_LABELS_FULL[selectedMonth]
                  : "Month"}
              </button>
            )
          )}
        </nav>
      </div>

      {step === "day" && selectedYear !== null && selectedMonth !== null && (
        <div className={cn(breadcrumbStepClass, "mt-4 text-brand-primary")}>
          <p className="text-center font-semibold">Child&apos;s day of Birth</p>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {WEEKDAYS.map((day) => (
              <span key={day} className="py-1">
                {day}
              </span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <span key={`empty-${index}`} aria-hidden="true" />;
              }

              const selectable = isWithinRange(day, minDate, maxDate);
              const selected = isSameDay(day, value);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={!selectable}
                  onClick={() => selectDay(day)}
                  className={cn(
                    "relative flex aspect-square items-center justify-center rounded-lg border border-border bg-white text-base font-semibold transition-colors",
                    selected && selectionTileSelectedClass,
                    !selected &&
                      selectable &&
                      "text-foreground hover:bg-brand-primary/10",
                    !selectable &&
                      "cursor-not-allowed border-transparent bg-transparent text-muted-foreground/35",
                    isToday &&
                      !selected &&
                      selectable &&
                      "border-brand-primary/40",
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-5 rounded-xl bg-white px-4 py-3 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Child&apos;s age today
        </p>
        <p className="mt-1 text-lg font-bold text-brand-secondary">{ageLabel}</p>
      </div>
    </div>
  );
}
