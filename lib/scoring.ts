// lib/scoring.ts
export type Answers = {
  problemSeverity: number;         // 1-5
  audienceClarity: number;         // 1-5
  willingnessToPay: number;        // 1-5
  pricingLeverage?: number;        // 1-5  (optional now; use 3 default if not on form yet)
  competitionDensity: number;      // 1-5 (5 = very crowded)
  differentiationClarity: number;  // 1-5
  reachability: number;            // 1-5
  organicPotential: number;        // 1-5
  mvpFeasibility: number;          // 1-5
  recurringUse: number;            // 1-5
  icpSpecific?: boolean;           // bonus rule (optional)
};

const WEIGHTS = {
  problemSeverity: 4,        // 20
  audienceClarity: 2,        // 10
  willingnessToPay: 3,       // 15
  pricingLeverage: 1,        // 5
  competitionDensity: 2,     // 10  (inverted)
  differentiationClarity: 1, // 5
  reachability: 2,           // 10
  organicPotential: 1,       // 5
  mvpFeasibility: 2,         // 10
  recurringUse: 2,           // 10
} as const;

export type Verdict = "Strong" | "Promising" | "Risky" | "Weak";

export function verdictFor(score: number): Verdict {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Promising";
  if (score >= 40) return "Risky";
  return "Weak";
}

export function computeScore(a: Answers) {
  // Invert competition: 1→5 (blue ocean) … 5→1 (red ocean)
  const invCompetition = 6 - a.competitionDensity;

  let base =
    a.problemSeverity * WEIGHTS.problemSeverity +
    a.audienceClarity * WEIGHTS.audienceClarity +
    a.willingnessToPay * WEIGHTS.willingnessToPay +
    (a.pricingLeverage ?? 3) * WEIGHTS.pricingLeverage + // default leverage=3 if not asked
    invCompetition * WEIGHTS.competitionDensity +
    a.differentiationClarity * WEIGHTS.differentiationClarity +
    a.reachability * WEIGHTS.reachability +
    a.organicPotential * WEIGHTS.organicPotential +
    a.mvpFeasibility * WEIGHTS.mvpFeasibility +
    a.recurringUse * WEIGHTS.recurringUse;

  // Bonuses
  if (a.icpSpecific && a.reachability >= 4) base += 5;
  if (a.differentiationClarity >= 4 && a.competitionDensity <= 3) base += 3;
  if (a.mvpFeasibility >= 4 && a.recurringUse >= 4) base += 2;

  // Penalties
  if (a.competitionDensity === 5 && a.differentiationClarity <= 3) base -= 5;
  if (a.willingnessToPay <= 2 /* && (a.pricingLeverage ?? 3) <= 2 */) base -= 4;
  if (a.reachability <= 2) base -= 3;
  if (a.recurringUse <= 2) base -= 3;

  const score = Math.max(0, Math.min(100, Math.round(base)));
  const verdict = verdictFor(score);

  return { score, verdict };
}
