"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePersonaThemeStore } from "@/store/persona-theme-store";
import { getStaticLabels } from "@/lib/static-translations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@/lib/fontawesome";

interface PolicyLayoutProps {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
}

export function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
  const pathname = usePathname();
  const currentLang = usePersonaThemeStore((state) => state.currentLang);
  const labels = getStaticLabels(currentLang);

  const navItems = [
    { label: labels.privacyPolicy, href: "/policies/privacy" },
    { label: labels.cookiePolicy, href: "/policies/cookie" },
    { label: labels.termsOfService, href: "/policies/terms" },
    { label: labels.refundPolicy, href: "/policies/refund" },
    { label: labels.electronicFinanceTerms, href: "/policies/finance" },
  ];

  return (
    <div className="min-h-screen bg-persona-surface/20 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-persona-primary/10 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-bold text-persona-muted hover:text-persona-primary transition-colors"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
            {labels.home}
          </Link>
          <div className="text-xs font-medium text-persona-muted/60 uppercase tracking-widest">
            Legal & Policies
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-4 py-2.5 text-sm font-bold transition-all",
                    pathname === item.href
                      ? "bg-persona-primary text-white shadow-md"
                      : "text-persona-muted hover:bg-persona-primary/5 hover:text-persona-primary"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <article className="flex-1 rounded-2xl border border-persona-primary/5 bg-white p-8 md:p-14 shadow-sm">
            <div className="mb-12 flex flex-col gap-3 border-b border-persona-primary/5 pb-10">
              <h1 className="text-4xl font-black tracking-tight text-persona-text font-persona-display leading-tight">
                {title}
              </h1>
              {lastUpdated && (
                <p className="text-xs font-bold text-persona-muted/40 uppercase tracking-widest">
                  마지막 업데이트: {lastUpdated}
                </p>
              )}
            </div>
            
            <div className={cn(
              "prose prose-sm prose-persona max-w-none",
              "prose-headings:font-black prose-headings:text-persona-text prose-headings:tracking-tight",
              "prose-h2:text-2xl prose-h2:mt-20 prose-h2:mb-10 prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-persona-primary/5",
              "prose-h3:text-lg prose-h3:mt-12 prose-h3:mb-6",
              "prose-p:text-persona-muted prose-p:leading-relaxed prose-p:mb-10",
              "prose-li:text-persona-muted prose-li:leading-relaxed prose-li:mb-4",
              "prose-strong:text-persona-text prose-strong:font-black",
              "prose-ul:my-10 prose-ol:my-10"
            )}>
              {children}
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
