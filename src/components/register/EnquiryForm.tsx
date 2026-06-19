"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Centre, EnquiryFormData } from "@/lib/types";
import {
  getEmailError,
  getMobileNumberError,
  isValidEmail,
  isValidMalaysianPhone,
} from "@/lib/validation";

interface EnquiryFormProps {
  centre: Centre;
}

const VISIT_DAYS = ["Weekday", "Weekend", "No Preference"] as const;
const WEEKDAY_TIMES = ["10 AM", "11 AM", "2 PM", "3 PM"];
const WEEKEND_TIMES = ["9 AM", "10:30 AM", "12 PM"];
const NO_PREF_TIMES = ["Morning", "Afternoon"];

const initialForm: EnquiryFormData = {
  parentName: "",
  mobileNumber: "",
  email: "",
  childName: "",
  childDob: "",
  programme: "",
  visitDay: "",
  visitTime: "",
  marketingConsent: false,
};

export function EnquiryForm({ centre }: EnquiryFormProps) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<EnquiryFormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormData, string>>>({});

  const programmeOptions = [
    centre.programmes.playgroup.available && {
      value: "playgroup",
      label: `Playgroup (${centre.programmes.playgroup.ageRange})`,
    },
    centre.programmes.junior.available && {
      value: "junior",
      label: `Junior (${centre.programmes.junior.ageRange})`,
    },
  ].filter(Boolean) as { value: string; label: string }[];

  const visitTimes =
    form.visitDay === "Weekday"
      ? WEEKDAY_TIMES
      : form.visitDay === "Weekend"
        ? WEEKEND_TIMES
        : NO_PREF_TIMES;

  const update = (field: keyof EnquiryFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateField = (
    field: keyof EnquiryFormData,
    value: string | boolean,
  ): string | undefined => {
    if (field === "parentName" && typeof value === "string") {
      return value.trim() ? undefined : "Required";
    }
    if (field === "mobileNumber" && typeof value === "string") {
      return getMobileNumberError(value);
    }
    if (field === "email" && typeof value === "string") {
      return getEmailError(value);
    }
    return undefined;
  };

  const handleBlur = (field: keyof EnquiryFormData) => {
    const error = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const hasStep0InvalidInput =
    (!!form.mobileNumber.trim() && !isValidMalaysianPhone(form.mobileNumber)) ||
    (!!form.email.trim() && !isValidEmail(form.email));

  const validateStep = (s: number): boolean => {
    const newErrors: typeof errors = {};
    if (s === 0) {
      const parentNameError = validateField("parentName", form.parentName);
      const mobileError = validateField("mobileNumber", form.mobileNumber);
      const emailError = validateField("email", form.email);
      if (parentNameError) newErrors.parentName = parentNameError;
      if (mobileError) newErrors.mobileNumber = mobileError;
      if (emailError) newErrors.email = emailError;
    }
    if (s === 1) {
      if (!form.childName.trim()) newErrors.childName = "Required";
      if (!form.childDob) newErrors.childDob = "Required";
      if (!form.programme) newErrors.programme = "Required";
      if (!form.visitDay) newErrors.visitDay = "Required";
      if (!form.visitTime) newErrors.visitTime = "Required";
      if (!form.marketingConsent)
        newErrors.marketingConsent = "Consent required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(1);
  };

  const handleSubmit = () => {
    if (validateStep(1)) setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center rounded-2xl bg-surface px-8 py-16 text-center"
      >
        <CheckCircle2 className="size-20 text-brand-secondary" />
        <h3 className="mt-6 text-2xl font-bold">Ready to submit!</h3>
        <p className="mt-3 max-w-md text-muted-foreground">
          Backend integration coming soon. This demo shows the enquiry flow for{" "}
          {centre.name}. In production, this will save to Supabase and notify
          the centre team.
        </p>
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => {
            setSubmitted(false);
            setStep(0);
            setForm(initialForm);
          }}
        >
          Start over
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex gap-2">
        {[0, 1].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              s <= step ? "bg-brand-secondary" : "bg-surface"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-5"
          >
            <h3 className="text-xl font-bold">Parent details</h3>
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent&apos;s name</Label>
              <Input
                id="parentName"
                placeholder="e.g. Sarah Lim"
                value={form.parentName}
                onChange={(e) => update("parentName", e.target.value)}
                onBlur={() => handleBlur("parentName")}
                aria-invalid={!!errors.parentName}
                className="min-h-12"
              />
              {errors.parentName && (
                <p className="text-sm text-destructive">{errors.parentName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Contact number</Label>
              <Input
                id="mobile"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="e.g. 012-345 6789"
                value={form.mobileNumber}
                onChange={(e) => update("mobileNumber", e.target.value)}
                onBlur={() => handleBlur("mobileNumber")}
                aria-invalid={!!errors.mobileNumber}
                className="min-h-12"
              />
              {errors.mobileNumber && (
                <p className="text-sm text-destructive">{errors.mobileNumber}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="e.g. name@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                aria-invalid={!!errors.email}
                className="min-h-12"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <Button
              onClick={handleNext}
              disabled={hasStep0InvalidInput}
              className="min-h-12 w-full"
            >
              Continue
              <ChevronRight className="size-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <h3 className="text-xl font-bold">Child & visit details</h3>
            <div className="space-y-2">
              <Label htmlFor="childName">Child&apos;s name or nickname</Label>
              <Input
                id="childName"
                value={form.childName}
                onChange={(e) => update("childName", e.target.value)}
                className="min-h-12"
              />
              {errors.childName && (
                <p className="text-sm text-destructive">{errors.childName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="childDob">Child&apos;s DOB or EDD</Label>
              <Input
                id="childDob"
                type="date"
                value={form.childDob}
                onChange={(e) => update("childDob", e.target.value)}
                className="min-h-12"
              />
              {errors.childDob && (
                <p className="text-sm text-destructive">{errors.childDob}</p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Interested programme</Label>
                <Select
                  value={form.programme}
                  onValueChange={(v) => v && update("programme", v)}
                >
                  <SelectTrigger className="min-h-12">
                    <SelectValue placeholder="Select programme" />
                  </SelectTrigger>
                  <SelectContent>
                    {programmeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.programme && (
                  <p className="text-sm text-destructive">{errors.programme}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Preferred visit day</Label>
                <Select
                  value={form.visitDay}
                  onValueChange={(v) => {
                    if (!v) return;
                    update("visitDay", v);
                    update("visitTime", "");
                  }}
                >
                  <SelectTrigger className="min-h-12">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {VISIT_DAYS.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.visitDay && (
                  <p className="text-sm text-destructive">{errors.visitDay}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Preferred visit time</Label>
                <Select
                  value={form.visitTime}
                  onValueChange={(v) => v && update("visitTime", v)}
                  disabled={!form.visitDay}
                >
                  <SelectTrigger className="min-h-12">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {visitTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.visitTime && (
                  <p className="text-sm text-destructive">{errors.visitTime}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-surface p-4">
              <Checkbox
                id="consent"
                checked={form.marketingConsent}
                onCheckedChange={(checked) =>
                  update("marketingConsent", checked === true)
                }
              />
              <Label htmlFor="consent" className="text-sm leading-relaxed">
                I agree to be contacted by Busy Bees Asia and its partners
                regarding enrolment at The Children&apos;s House Montessori.
              </Label>
            </div>
            {errors.marketingConsent && (
              <p className="text-sm text-destructive">{errors.marketingConsent}</p>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(0)}
                className="min-h-12 flex-1"
              >
                <ChevronLeft className="size-4" />
                Back
              </Button>
              <Button onClick={handleSubmit} className="min-h-12 flex-1">
                Book a tour
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
