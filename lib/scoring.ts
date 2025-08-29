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

export type ScoreResult = {
  score: number;
  verdict: Verdict;
  subscores: {
    market: number;
    monetization: number;
    competitionMoat: number;
    distribution: number;
    feasibility: number;
    retention: number;
  };
  strengths: string[];
  risks: string[];
  nextSteps: string[];
};

export function verdictFor(score: number): Verdict {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Promising";
  if (score >= 40) return "Risky";
  return "Weak";
}

function generateInsights(a: Answers, score: number): { strengths: string[]; risks: string[]; nextSteps: string[] } {
  const strengths: string[] = [];
  const risks: string[] = [];
  const nextSteps: string[] = [];

  // Generate strengths
  if (a.problemSeverity >= 4) strengths.push("Addresses a critical, painful problem");
  if (a.willingnessToPay >= 4) strengths.push("Strong market validation - people already pay for solutions");
  if (a.audienceClarity >= 4) strengths.push("Clear, well-defined target customer");
  if (a.differentiationClarity >= 4) strengths.push("Strong differentiation from competitors");
  if (a.mvpFeasibility >= 4) strengths.push("Quick time-to-market with MVP");
  if (a.reachability >= 4) strengths.push("Multiple proven channels to reach customers");
  if (a.organicPotential >= 4) strengths.push("High potential for organic growth");
  if (a.recurringUse >= 4) strengths.push("High usage frequency drives retention");

  // Generate risks
  if (a.competitionDensity >= 4) risks.push("Highly competitive market with strong incumbents");
  if (a.problemSeverity <= 2) risks.push("Problem may not be painful enough to drive purchases");
  if (a.willingnessToPay <= 2) risks.push("Market may not be willing to pay for solutions");
  if (a.reachability <= 2) risks.push("Difficult to reach target customers cost-effectively");
  if (a.differentiationClarity <= 2) risks.push("Unclear differentiation from existing solutions");
  if (a.mvpFeasibility <= 2) risks.push("Long development time may miss market opportunity");
  if (a.recurringUse <= 2) risks.push("Low usage frequency may hurt retention and LTV");

  // Generate next steps based on score and weaknesses
  if (score >= 70) {
    nextSteps.push("Build and test MVP with early customers");
    nextSteps.push("Validate pricing with target audience");
    nextSteps.push("Develop go-to-market strategy");
  } else if (score >= 50) {
    if (a.audienceClarity <= 3) nextSteps.push("Define ideal customer profile more clearly");
    if (a.problemSeverity <= 3) nextSteps.push("Validate problem severity with potential customers");
    if (a.willingnessToPay <= 3) nextSteps.push("Research willingness to pay through customer interviews");
    nextSteps.push("Address key weaknesses before building");
  } else {
    nextSteps.push("Consider pivoting or major adjustments to the idea");
    if (a.problemSeverity <= 2) nextSteps.push("Find a more critical problem to solve");
    if (a.audienceClarity <= 2) nextSteps.push("Narrow down to a specific customer segment");
    nextSteps.push("Conduct extensive market research before proceeding");
  }

  return { strengths, risks, nextSteps };
}

export function computeScore(a: Answers): ScoreResult {
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

  // Calculate subscores (0-100 scale)
  const subscores = {
    market: Math.round((a.problemSeverity + a.audienceClarity) * 10), // max 100
    monetization: Math.round((a.willingnessToPay + (a.pricingLeverage ?? 3)) * 10), // max 100
    competitionMoat: Math.round((invCompetition + a.differentiationClarity) * 10), // max 100
    distribution: Math.round((a.reachability + a.organicPotential) * 10), // max 100
    feasibility: Math.round(a.mvpFeasibility * 20), // max 100
    retention: Math.round(a.recurringUse * 20), // max 100
  };

  const { strengths, risks, nextSteps } = generateInsights(a, score);

  return { score, verdict, subscores, strengths, risks, nextSteps };
}
