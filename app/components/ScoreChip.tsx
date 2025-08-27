"use client";
import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { bandClasses, bandLabel, getBand } from "@/lib/score";

export default function ScoreChip({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const band = getBand(clamped);

  // animated number
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 16 });
  const text = useTransform(spring, (v) => Math.round(v));

  React.useEffect(() => {
    mv.set(clamped);
  }, [clamped, mv]);

  return (
    <div
      className={
        "inline-flex items-center gap-2 rounded-[999px] border px-3 py-1.5 text-sm font-semibold " +
        bandClasses(band)
      }
    >
      <motion.span>{text}</motion.span>
      <span>/ 100</span>
      <span className="opacity-60">·</span>
      <span>{bandLabel(band)}</span>
    </div>
  );
}
