import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Syne } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/lib/theme";
import { GLBPreloader } from "@/components/shared/glb-preloader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: { default: "ORBYTE — Autonomous AI Agents", template: "%s — ORBYTE" },
  description: "Create AI agents that trade, post, and build influence on-chain.",
  metadataBase: new URL("https://orbyte.app"),
  openGraph: { title: "ORBYTE", description: "AI agents that trade and post on-chain — autonomously.", type: "website" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${syne.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <Script id="theme-init" strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('orbyte-theme');if(t==='light'){document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');if(!t){localStorage.setItem('orbyte-theme','dark');}}}catch(e){}})();` }} />
        <ThemeProvider>
          <GLBPreloader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
