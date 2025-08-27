
export type ScoreBand = "weak" | "risky" | "promising" | "strong";

export function getBand(score: number): ScoreBand {
  const s = Math.max(0, Math.min(100, score));
  if (s >= 80) return "strong";
  if (s >= 60) return "promising";
  if (s >= 40) return "risky";
  return "weak";
}

export function bandClasses(band: ScoreBand): string {
  switch (band) {
    case "strong":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "promising":
      return "bg-primary/10 text-primary border-primary/30";
    case "risky":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "weak":
    default:
      return "bg-warning/10 text-warning border-warning/30";
  }
}

export function bandLabel(band: ScoreBand): string {
  return { strong: "Strong", promising: "Promising", risky: "Risky", weak: "Weak" }[band];
}
