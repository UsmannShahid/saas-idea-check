
import { Button } from "@/components/ui/Button";
import ScoreChip from "@/components/ScoreChip";

export default function Home() {
  return (
    <section className="py-16">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
        Is your <span className="text-primary">SaaS idea</span> worth building?
      </h1>
      <p className="mt-4 text-lg text-muted-fg">
        Get a research-backed score in 60 seconds. Free. No signup.
      </p>
      <a
        href="/evaluate"
        className="mt-8 inline-flex items-center justify-center rounded-[999px] h-12 px-8
                   bg-primary text-white font-medium shadow-soft hover:opacity-95 transition"
      >
        Try the free tool
      </a>
      
    </section>
    
  );
}

