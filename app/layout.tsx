import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jbmono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jbmono.variable}`}>
      <body suppressHydrationWarning className="min-h-dvh bg-background text-foreground antialiased">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
