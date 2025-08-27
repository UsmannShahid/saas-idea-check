"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="font-extrabold text-lg tracking-tight">
          <span className="text-primary">Idea</span>Check
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-fg">
          <Link href="/evaluate" className="hover:text-foreground transition">Tool</Link>
          <Link href="/blog" className="hover:text-foreground transition">Blog</Link>
          <Link href="/about" className="hover:text-foreground transition">About</Link>
        </nav>

        {/* CTA */}
        <Link
          href="/evaluate"
          className="hidden md:inline-flex items-center justify-center rounded-[999px] h-10 px-5
                     bg-primary text-white font-medium shadow-soft hover:opacity-95 transition"
        >
          Try Free Tool
        </Link>

        {/* Mobile menu placeholder (optional later) */}
        <Link
          href="/evaluate"
          className="md:hidden inline-flex items-center justify-center rounded-[999px] h-9 px-4
                     bg-primary text-white font-medium"
        >
          Start
        </Link>
      </div>
    </header>
  );
}
