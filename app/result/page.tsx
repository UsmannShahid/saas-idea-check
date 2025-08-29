"use client";

import { useSearchParams } from "next/navigation";
import { ScoreDashboard } from "@/components/ScoreDashboard";
import type { ScoreResult } from "@/lib/scoring";
import { Suspense } from "react";

function ResultContent() {
  const searchParams = useSearchParams();
  const resultData = searchParams.get("data");

  if (!resultData) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-muted-fg">No results found</h1>
        <p className="mt-2 text-muted-fg">Please complete the evaluation first.</p>
        <a 
          href="/evaluate" 
          className="mt-4 inline-block rounded-[999px] h-10 px-5 bg-primary text-white shadow-soft hover:opacity-95"
        >
          Start Evaluation
        </a>
      </div>
    );
  }

  let result: ScoreResult;
  try {
    result = JSON.parse(decodeURIComponent(resultData));
  } catch {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-warning">Invalid result data</h1>
        <p className="mt-2 text-muted-fg">There was an error loading your results.</p>
        <a 
          href="/evaluate" 
          className="mt-4 inline-block rounded-[999px] h-10 px-5 bg-primary text-white shadow-soft hover:opacity-95"
        >
          Start New Evaluation
        </a>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Your SaaS Idea Score
        </h1>
        <p className="text-muted-fg">
          Here&apos;s your detailed evaluation and recommendations
        </p>
      </div>

      <div className="animate-fadeInUp">
        <ScoreDashboard result={result} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `My SaaS Idea Score: ${result.score}/100`,
                text: `I scored ${result.score}/100 on my SaaS idea evaluation. Check out the detailed breakdown!`,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }
          }}
          className="rounded-[999px] h-12 px-6 border border-border bg-background text-foreground hover:bg-muted transition-colors"
        >
          📋 Share Results
        </button>
        
        <button 
          onClick={() => window.print()}
          className="rounded-[999px] h-12 px-6 border border-border bg-background text-foreground hover:bg-muted transition-colors"
        >
          🖨️ Save as PDF
        </button>
        
        <a 
          href="/evaluate" 
          className="rounded-[999px] h-12 px-6 bg-primary text-white shadow-soft hover:opacity-95 transition-opacity flex items-center justify-center"
        >
          ✨ Evaluate Another Idea
        </a>
      </div>

      {/* Email Capture (Optional) */}
      <div className="bg-muted/50 rounded-2xl p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Want detailed startup advice?</h3>
        <p className="text-sm text-muted-fg mb-4">
          Get a personalized action plan and weekly tips delivered to your inbox.
        </p>
        <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="your@email.com"
            className="flex-1 rounded-2xl border border-border bg-white p-3 text-base outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button 
            type="submit"
            className="rounded-2xl h-12 px-6 bg-accent text-white shadow-soft hover:opacity-95 transition-opacity"
          >
            Get Tips
          </button>
        </form>
        <p className="text-xs text-muted-fg mt-2">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-8"></div>
          <div className="h-64 bg-muted rounded-2xl"></div>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}