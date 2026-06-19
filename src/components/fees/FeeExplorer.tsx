"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarHeart, Clock } from "lucide-react";
import type { Centre, CentreFees } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FeeExplorerProps {
  centre: Centre;
  fees: CentreFees | undefined;
}

const feeSelectTriggerClass =
  "!w-full !h-auto min-h-12 px-4 py-3 data-[size=default]:!h-auto";
const feeSelectContentClass = "p-1.5";
const feeSelectItemClass = "min-h-11 py-2.5 pl-3 pr-8";

function AnimatedPrice({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-4xl font-bold text-brand-primary"
    >
      RM {value.toLocaleString()}
    </motion.span>
  );
}

export function FeeExplorer({ centre, fees }: FeeExplorerProps) {
  const ageGroups = useMemo(() => {
    if (!fees?.tiers) return [];
    return [...new Set(fees.tiers.map((t) => t.ageGroup))];
  }, [fees]);

  const programmeTypes = useMemo(() => {
    if (!fees?.tiers) return [];
    return [...new Set(fees.tiers.map((t) => t.programmeType))];
  }, [fees]);

  const [ageGroup, setAgeGroup] = useState(ageGroups[0] ?? "");
  const [showOneTime, setShowOneTime] = useState(false);
  const [programmeType, setProgrammeType] = useState<
    "Half Day" | "Extended Day" | "Full Day"
  >((programmeTypes[0] as "Half Day") ?? "Half Day");

  const selectedTier = fees?.tiers.find(
    (t) => t.ageGroup === ageGroup && t.programmeType === programmeType,
  );

  if (!fees?.available || !fees.tiers.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-surface px-8 py-16 text-center">
        <CalendarHeart className="size-16 text-brand-secondary" />
        <h3 className="mt-6 text-2xl font-bold">Fees available on tour</h3>
        <p className="mt-3 max-w-md text-muted-foreground">
          Fee information for {centre.name} is best discussed during your
          personalised school tour. Our team will walk you through programme
          options and payment plans.
        </p>
        <ul className="mt-6 space-y-2 text-left text-sm text-muted-foreground">
          <li>• Registration fee applies upon enrolment</li>
          <li>• Termly billing (1 term = 3 months)</li>
          <li>• Half-day, extended, and full-day options available</li>
          <li>• Ask about sibling discounts during your visit</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(200px,1fr)_minmax(0,3fr)] lg:items-stretch">
        <div className="grid w-full grid-cols-1 gap-4">
          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium">Age group</label>
            <Select value={ageGroup} onValueChange={(v) => v && setAgeGroup(v)}>
              <SelectTrigger className={feeSelectTriggerClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={feeSelectContentClass}>
                {ageGroups.map((group) => (
                  <SelectItem
                    key={group}
                    value={group}
                    className={feeSelectItemClass}
                  >
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <label className="mb-2.5 block text-sm font-medium">
              Programme type
            </label>
            <Select
              value={programmeType}
              onValueChange={(v) =>
                v &&
                setProgrammeType(v as "Half Day" | "Extended Day" | "Full Day")
              }
            >
              <SelectTrigger className={feeSelectTriggerClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={feeSelectContentClass}>
                {programmeTypes.map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className={feeSelectItemClass}
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.div
          key={`${ageGroup}-${programmeType}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-surface p-8 lg:h-full"
        >
          {selectedTier && (
            <>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4 shrink-0 text-brand-secondary" aria-hidden />
                {selectedTier.schoolHours}
              </p>
              <div className="mt-4 flex flex-wrap items-end gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly</p>
                  <AnimatedPrice value={selectedTier.monthlyFee} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Per term (3 months)
                  </p>
                  <p className="text-2xl font-bold">
                    RM {selectedTier.termFee.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deposit</p>
                  <p className="text-2xl font-bold">
                    RM {selectedTier.deposit.toLocaleString()}
                  </p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>

      <div className="rounded-xl border">
        <button
          type="button"
          aria-expanded={showOneTime}
          aria-controls="one-time-fees-panel"
          onClick={() => setShowOneTime(!showOneTime)}
          className="flex w-full items-center justify-between px-4 py-4 text-base font-semibold"
        >
          One-time fees upon registration
          <ChevronDown
            className={cn(
              "size-5 transition-transform duration-300 ease-out",
              showOneTime && "rotate-180",
            )}
          />
        </button>
        <div
          id="one-time-fees-panel"
          aria-hidden={!showOneTime}
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-out",
            showOneTime ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <dl
              className={cn(
                "space-y-2 border-t px-4 py-4 text-sm transition-opacity duration-300 ease-out",
                showOneTime ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="flex justify-between">
                <dt>Registration fee</dt>
                <dd className="font-semibold">
                  RM {fees.oneTimeFees.registrationFee.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Annual resource fee</dt>
                <dd className="font-semibold">
                  RM {fees.oneTimeFees.annualResourceFee.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Books & stationery (18m – 3y)</dt>
                <dd className="font-semibold">
                  RM {fees.oneTimeFees.bookStationeryUnder3.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Books & stationery (4 – 6y)</dt>
                <dd className="font-semibold">
                  RM {fees.oneTimeFees.bookStationeryOver3.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Insurance (one-time)</dt>
                <dd className="font-semibold">
                  RM {fees.oneTimeFees.insurance.toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
