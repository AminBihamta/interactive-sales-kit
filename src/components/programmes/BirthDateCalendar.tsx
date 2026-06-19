"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

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

function clampViewMonth(date: Date, min: Date, max: Date) {
  const clamped = startOfMonth(date);
  if (clamped < startOfMonth(min)) return startOfMonth(min);
  if (clamped > startOfMonth(max)) return startOfMonth(max);
  return clamped;
}

export function BirthDateCalendar({
  value,
  onChange,
  minDate,
  maxDate,
  ageLabel,
}: BirthDateCalendarProps) {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(value));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(() => value.getFullYear());

  const minYear = minDate.getFullYear();
  const maxYear = maxDate.getFullYear();

  const days = useMemo(() => {
    const first = startOfMonth(viewMonth);
    const leadingEmpty = first.getDay();
    const daysInMonth = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth() + 1,
      0,
    ).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < leadingEmpty; i += 1) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day));
    }
    return cells;
  }, [viewMonth]);

  const monthLabel = viewMonth.toLocaleDateString("en-MY", {
    month: "long",
    year: "numeric",
  });

  const canGoPrev = startOfMonth(viewMonth) > startOfMonth(minDate);
  const canGoNext = startOfMonth(viewMonth) < startOfMonth(maxDate);
  const canGoPrevYear = pickerYear > minYear;
  const canGoNextYear = pickerYear < maxYear;

  const openPicker = () => {
    setPickerYear(viewMonth.getFullYear());
    setPickerOpen(true);
  };

  const selectMonth = (month: number) => {
    const next = clampViewMonth(
      new Date(pickerYear, month, 1),
      minDate,
      maxDate,
    );
    setViewMonth(next);
    setPickerOpen(false);
  };

  return (
    <div className="flex h-full flex-col rounded-2xl bg-surface p-6 lg:rounded-3xl">
      <h3 className="text-lg font-semibold text-foreground">
        When was your child born?
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Tap a date on the calendar to find the right programme
      </p>

      <div className="mt-6 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label={pickerOpen ? "Previous year" : "Previous month"}
          disabled={pickerOpen ? !canGoPrevYear : !canGoPrev}
          onClick={() => {
            if (pickerOpen) {
              setPickerYear((year) => year - 1);
              return;
            }
            setViewMonth((current) =>
              clampViewMonth(
                new Date(current.getFullYear(), current.getMonth() - 1, 1),
                minDate,
                maxDate,
              ),
            );
          }}
          className="inline-flex size-9 items-center justify-center rounded-full text-brand-secondary transition-colors hover:bg-white disabled:opacity-30"
        >
          <ChevronLeft className="size-5" />
        </button>

        <button
          type="button"
          aria-expanded={pickerOpen}
          aria-label="Choose month and year"
          onClick={() => (pickerOpen ? setPickerOpen(false) : openPicker())}
          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
        >
          {pickerOpen ? String(pickerYear) : monthLabel}
        </button>

        <button
          type="button"
          aria-label={pickerOpen ? "Next year" : "Next month"}
          disabled={pickerOpen ? !canGoNextYear : !canGoNext}
          onClick={() => {
            if (pickerOpen) {
              setPickerYear((year) => year + 1);
              return;
            }
            setViewMonth((current) =>
              clampViewMonth(
                new Date(current.getFullYear(), current.getMonth() + 1, 1),
                minDate,
                maxDate,
              ),
            );
          }}
          className="inline-flex size-9 items-center justify-center rounded-full text-brand-secondary transition-colors hover:bg-white disabled:opacity-30"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {pickerOpen ? (
        <div className="mt-4 grid grid-cols-3 gap-2 content-start">
          {MONTH_LABELS.map((label, month) => {
            const enabled = isMonthInRange(pickerYear, month, minDate, maxDate);
            const isViewing =
              viewMonth.getFullYear() === pickerYear &&
              viewMonth.getMonth() === month;

            return (
              <button
                key={label}
                type="button"
                disabled={!enabled}
                onClick={() => selectMonth(month)}
                className={cn(
                  "rounded-xl py-3 text-sm font-semibold transition-colors",
                  isViewing && "bg-brand-primary text-white shadow-md shadow-brand-primary/30",
                  !isViewing &&
                    enabled &&
                    "text-foreground hover:bg-brand-primary/10",
                  !enabled && "cursor-not-allowed text-muted-foreground/35",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                  onClick={() => onChange(day)}
                  className={cn(
                    "relative flex aspect-square items-center justify-center rounded-full text-sm font-medium transition-colors",
                    selected &&
                      "bg-brand-primary text-white shadow-md shadow-brand-primary/30",
                    !selected &&
                      selectable &&
                      "text-foreground hover:bg-brand-primary/10",
                    !selectable && "cursor-not-allowed text-muted-foreground/35",
                    isToday &&
                      !selected &&
                      selectable &&
                      "ring-1 ring-brand-primary/40 ring-inset",
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </>
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
