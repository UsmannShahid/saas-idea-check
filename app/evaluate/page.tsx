"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ScoreChip from "@/components/ScoreChip";

const oneToFive = z
  .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])
  .describe("1-5 scale");

const Schema = z.object({
  idea: z.string().min(10, "Give us 1–2 sentences about your idea."),
  problemSeverity: oneToFive,
  willingnessToPay: oneToFive,
  reachability: oneToFive,
});

type FormData = z.infer<typeof Schema>;

// quick preview using first 3 signals only
function previewScoreCalc(p: number, w: number, r: number) {
  // weights: severity x4, willingness x3, reach x2 (max raw = 45)
  const raw = p * 4 + w * 3 + r * 2;
  return Math.round((raw / 45) * 100); // scale to 0–100
}

export default function EvaluatePage() {
  const [preview, setPreview] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      problemSeverity: 3,
      willingnessToPay: 3,
      reachability: 3,
    },
  });

  const onSubmit = (data: FormData) => {
    const s = previewScoreCalc(
      data.problemSeverity,
      data.willingnessToPay,
      data.reachability
    );
    setPreview(s);
    console.log("Submitted:", data, "Preview score:", s);
  };

  const RadioRow = ({
    name,
    label,
    helper,
  }: {
    name: keyof FormData;
    label: string;
    helper?: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium">{label}</label>
        {helper && <span className="text-xs text-muted-fg">{helper}</span>}
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((v) => (
          <label
            key={v}
            className="flex-1 cursor-pointer rounded-2xl border border-border p-3 text-center hover:bg-muted"
          >
            <input
              type="radio"
              value={v}
              {...register(name, { valueAsNumber: true })}
              className="peer sr-only"
            />
            <span className="block text-sm font-medium peer-checked:text-primary">
              {v}
            </span>
            <span className="mt-1 block text-[11px] text-muted-fg">
              {v === 1
                ? "Low"
                : v === 3
                ? "Medium"
                : v === 5
                ? "High"
                : "\u00A0"}
            </span>
          </label>
        ))}
      </div>
      {errors[name] && (
        <p className="text-warning text-sm">Please select a value.</p>
      )}
    </div>
  );

  return (
    <section className="space-y-8 max-w-2xl">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
        Evaluate your idea
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Idea */}
        <div>
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

        {/* Q1–Q3 */}
        <RadioRow
          name="problemSeverity"
          label="How painful is the problem you solve?"
          helper="1 = not painful · 5 = mission-critical"
        />
        <RadioRow
          name="willingnessToPay"
          label="Do buyers already pay for alternatives?"
          helper="1 = rarely · 5 = commonly/clearly"
        />
        <RadioRow
          name="reachability"
          label="How easy is it to reach your ideal customer?"
          helper="1 = hard/expensive · 5 = many proven channels"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-[999px] h-11 px-6
                     bg-primary text-white font-medium shadow-soft hover:opacity-95 disabled:opacity-60"
        >
          {isSubmitting ? "Scoring…" : "Get my score"}
        </button>
      </form>

      {preview !== null && (
        <div className="pt-4">
          <ScoreChip score={preview} />
          <p className="mt-2 text-sm text-muted-fg">
            This is a quick preview using the first 3 signals.
          </p>
        </div>
      )}
    </section>
  );
}
