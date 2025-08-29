import { CategoryBar } from "./CategoryBar";
import ScoreChip from "./ScoreChip";
import type { ScoreResult } from "@/lib/scoring";

export function ScoreDashboard({ result }: { result: ScoreResult }) {
  return (
    <div className="space-y-6 p-6 rounded-2xl border border-border bg-white">
      {/* Overall Score */}
      <div className="text-center">
        <ScoreChip score={result.score} />
        <p className="mt-2 text-sm text-muted-fg">
          {result.verdict} idea • {result.score}/100
        </p>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Breakdown</h3>
        <div className="grid gap-3">
          <CategoryBar label="Market fit" value={result.subscores.market} />
          <CategoryBar label="Monetization" value={result.subscores.monetization} />
          <CategoryBar label="Competition moat" value={result.subscores.competitionMoat} />
          <CategoryBar label="Distribution" value={result.subscores.distribution} />
          <CategoryBar label="Build feasibility" value={result.subscores.feasibility} />
          <CategoryBar label="User retention" value={result.subscores.retention} />
        </div>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Strengths */}
        {result.strengths.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-green-700">✓ Strengths</h4>
            <ul className="space-y-1">
              {result.strengths.map((strength, i) => (
                <li key={i} className="text-sm text-muted-fg">
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks */}
        {result.risks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-amber-700">⚠ Risks</h4>
            <ul className="space-y-1">
              {result.risks.map((risk, i) => (
                <li key={i} className="text-sm text-muted-fg">
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Next Steps */}
      {result.nextSteps.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-primary">→ Next Steps</h4>
          <ul className="space-y-1">
            {result.nextSteps.map((step, i) => (
              <li key={i} className="text-sm text-muted-fg">
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
