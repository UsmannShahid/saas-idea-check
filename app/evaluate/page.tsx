"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { computeScore } from "@/lib/scoring";
import { RadioCard } from "@/components/RadioCard";

// Schema (same fields, we'll render them across steps)
const Schema = z.object({
  idea: z.string().min(10, "Give us 1–2 sentences about your idea."),
  problemSeverity: z.coerce.number().int().min(1).max(5),
  willingnessToPay: z.coerce.number().int().min(1).max(5),
  reachability: z.coerce.number().int().min(1).max(5),
  competitionDensity: z.coerce.number().int().min(1).max(5),
  differentiationClarity: z.coerce.number().int().min(1).max(5),
  mvpFeasibility: z.coerce.number().int().min(1).max(5),
  audienceClarity: z.coerce.number().int().min(1).max(5),
  organicPotential: z.coerce.number().int().min(1).max(5),
  recurringUse: z.coerce.number().int().min(1).max(5),
  // optional future bonus:
  // icpSpecific: z.coerce.boolean().optional(),
});

type FormData = z.infer<typeof Schema>;

// Mini progress bar
function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// Reusable radio row (1..5) using RadioCard components
function RadioRow({
  name,
  label,
  helper,
  register,
  error,
}: {
  name: keyof FormData;
  label: string;
  helper?: string;
  register: ReturnType<typeof useForm<FormData>>["register"];
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium">{label}</label>
        {helper && <span className="text-xs text-muted-fg">{helper}</span>}
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((v) => (
          <RadioCard
            key={v}
            name={name}
            value={v}
            register={register}
            labelTop={v.toString()}
            labelBottom={v === 1 ? "Low" : v === 3 ? "Medium" : v === 5 ? "High" : undefined}
          />
        ))}
      </div>
      {error && <p className="text-warning text-sm">{error}</p>}
    </div>
  );
}

export default function EvaluatePage() {
  const router = useRouter();
  
  // Wizard state
  const steps = useMemo(
    () => [
      { key: "idea", title: "Your idea" },
      { key: "market", title: "Market & demand" },
      { key: "competition", title: "Competition & feasibility" },
      { key: "audience", title: "Audience & retention" },
    ],
    []
  );
  const [step, setStep] = useState(0);
  const progress = Math.round(((step + 1) / steps.length) * 100);

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      idea: "",
      problemSeverity: 3,
      willingnessToPay: 3,
      reachability: 3,
      competitionDensity: 3,
      differentiationClarity: 3,
      mvpFeasibility: 3,
      audienceClarity: 3,
      organicPotential: 3,
      recurringUse: 3,
    },
    mode: "onSubmit", // we’ll call trigger() per step
  });

  // Validate only fields of current step before moving forward
  const validateCurrentStep = async () => {
    if (step === 0) {
      return await trigger(["idea"]);
    }
    if (step === 1) {
      return await trigger([
        "problemSeverity",
        "willingnessToPay",
        "reachability",
      ]);
    }
    if (step === 2) {
      return await trigger([
        "competitionDensity",
        "differentiationClarity",
        "mvpFeasibility",
      ]);
    }
    if (step === 3) {
      return await trigger(["audienceClarity", "organicPotential", "recurringUse"]);
    }
    return true;
  };

  const next = async () => {
    const ok = await validateCurrentStep();
    if (!ok) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  // Final submit (on last step)
  const onSubmit: SubmitHandler<FormData> = (data) => {
    const result = computeScore({
      problemSeverity: data.problemSeverity,
      audienceClarity: data.audienceClarity,
      willingnessToPay: data.willingnessToPay,
      competitionDensity: data.competitionDensity,
      differentiationClarity: data.differentiationClarity,
      reachability: data.reachability,
      organicPotential: data.organicPotential,
      mvpFeasibility: data.mvpFeasibility,
      recurringUse: data.recurringUse,
    });
    
    // Navigate to result page with data
    const resultData = encodeURIComponent(JSON.stringify(result));
    router.push(`/result?data=${resultData}`);
  };

  return (
    <section className="max-w-2xl space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Evaluate your idea
        </h1>
        <Progress value={progress} />
        
        {/* Step Pills */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                index === step
                  ? "bg-primary text-white shadow-soft scale-110"
                  : index < step
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-fg"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        
        <p className="text-sm text-muted-fg text-center">
          {steps[step].title}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
        autoComplete="off"
      >
        {/* STEP 1 — Idea */}
        {step === 0 && (
          <div className="space-y-4 animate-fadeInUp" key="step-0">
            <label className="block text-sm font-medium">
              Describe your idea
              <textarea
                {...register("idea")}
                rows={5}
                placeholder="e.g., A $5 AI evaluator that scores startup ideas and suggests next steps."
                className="mt-1 w-full rounded-2xl border border-border bg-white p-3 text-base outline-none focus:ring-2 focus:ring-primary/40"
              />
            </label>
            {errors.idea && (
              <p className="text-warning text-sm">{errors.idea.message}</p>
            )}
          </div>
        )}

        {/* STEP 2 — Market & demand */}
        {step === 1 && (
          <div className="space-y-6 animate-slideIn" key="step-1">
            <RadioRow
              name="problemSeverity"
              label="How painful is the problem you solve?"
              helper="1 = not painful · 5 = mission-critical"
              register={register}
              error={errors.problemSeverity?.message as string | undefined}
            />
            <RadioRow
              name="willingnessToPay"
              label="Do buyers already pay for alternatives?"
              helper="1 = rarely · 5 = commonly/clearly"
              register={register}
              error={errors.willingnessToPay?.message as string | undefined}
            />
            <RadioRow
              name="reachability"
              label="How easy is it to reach your ideal customer?"
              helper="1 = hard/expensive · 5 = many proven channels"
              register={register}
              error={errors.reachability?.message as string | undefined}
            />
          </div>
        )}

        {/* STEP 3 — Competition & feasibility */}
        {step === 2 && (
          <div className="space-y-6 animate-scaleIn" key="step-2">
            <RadioRow
              name="competitionDensity"
              label="How crowded is your exact niche?"
              helper="1 = few/none · 5 = many strong incumbents"
              register={register}
              error={errors.competitionDensity?.message as string | undefined}
            />
            <RadioRow
              name="differentiationClarity"
              label="How clear is your differentiation vs. top tools?"
              helper="1 = unclear · 5 = very clear with proof"
              register={register}
              error={
                errors.differentiationClarity?.message as string | undefined
              }
            />
            <RadioRow
              name="mvpFeasibility"
              label="How fast can you ship an MVP?"
              helper="1 = >12 weeks · 5 = <2 weeks"
              register={register}
              error={errors.mvpFeasibility?.message as string | undefined}
            />
          </div>
        )}

        {/* STEP 4 — Audience & retention */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeInUp" key="step-3">
            <RadioRow
              name="audienceClarity"
              label="How clearly defined is your ideal customer profile?"
              helper="1 = vague · 5 = very specific ICP"
              register={register}
              error={errors.audienceClarity?.message as string | undefined}
            />
            <RadioRow
              name="organicPotential"
              label="Organic potential (SEO / communities / virality)"
              helper="1 = low · 5 = high"
              register={register}
              error={errors.organicPotential?.message as string | undefined}
            />
            <RadioRow
              name="recurringUse"
              label="Expected usage frequency"
              helper="1 = ad-hoc · 5 = daily/weekly"
              register={register}
              error={errors.recurringUse?.message as string | undefined}
            />
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="rounded-[999px] h-10 px-5 border border-border bg-background text-foreground hover:bg-muted disabled:opacity-50"
          >
            Back
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="rounded-[999px] h-10 px-5 bg-primary text-white shadow-soft hover:opacity-95"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-[999px] h-10 px-5 bg-primary text-white shadow-soft hover:opacity-95 disabled:opacity-60"
            >
              {isSubmitting ? "Scoring…" : "See my score"}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
