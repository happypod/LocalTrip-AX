"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faMapLocationDot,
  faUsers,
  faUser,
} from "@/lib/fontawesome";
import { usePersonaCopy } from "@/hooks/use-persona-copy";
import { usePersonaThemeStore } from "@/store/persona-theme-store";
import { getStaticLabels } from "@/lib/static-translations";
import { cn } from "@/lib/utils";

export function Footer() {
  const copy = usePersonaCopy();
  const currentLang = usePersonaThemeStore((state) => state.currentLang);
  const labels = getStaticLabels(currentLang);

  const policyLinks = [
    { label: labels.privacyPolicy, href: "/policies/privacy" },
    { label: labels.cookiePolicy, href: "/policies/cookie" },
    { label: labels.termsOfService, href: "/policies/terms" },
    { label: labels.refundPolicy, href: "/policies/refund" },
    { label: labels.electronicFinanceTerms, href: "/policies/finance" },
  ];

  return (
    <footer className="mt-auto border-t border-[#dde4e6] bg-persona-surface/30 pt-12 pb-20 md:pb-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand and Contact */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xl font-black text-persona-text font-persona-display">
                {copy.hero.title}
              </span>
              <p className="text-sm text-persona-muted max-w-xs leading-relaxed">
                태안 소원면 주민들과 함께 만들어가는<br />
                지속 가능한 로컬 여행 플랫폼입니다.
              </p>
            </div>
            
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-persona-text">{labels.touristInquiry}</span>
                <a href="tel:010-2840-1649" className="text-persona-muted hover:text-persona-primary transition-colors">010-2840-1649</a>
              </div>
              <a href="https://www.sowontrip.com" target="_blank" rel="noreferrer" className="text-persona-muted hover:text-persona-primary transition-colors">www.sowontrip.com</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-3">
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-persona-muted/60">Platform</h4>
              <nav className="flex flex-col gap-2.5 text-sm font-bold text-persona-muted">
                <Link href="/stays" className="hover:text-persona-primary transition-colors">{copy.nav.stay}</Link>
                <Link href="/experiences" className="hover:text-persona-primary transition-colors">{copy.nav.experience}</Link>
                <Link href="/programs" className="hover:text-persona-primary transition-colors">{copy.nav.localProduct}</Link>
                <Link href="/courses" className="hover:text-persona-primary transition-colors">{copy.nav.course}</Link>
              </nav>
            </div>
            
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-persona-muted/60">Support</h4>
              <nav className="flex flex-col gap-2.5 text-sm font-bold text-persona-muted">
                <Link href="/customer-center" className="hover:text-persona-primary transition-colors">{labels.navCustomerCenter}</Link>
                <Link href="/partner/apply" className="hover:text-persona-primary transition-colors">{labels.partnerTitle}</Link>
                <Link href="/map" className="hover:text-persona-primary transition-colors">{labels.mapTitle}</Link>
              </nav>
            </div>

            <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-persona-muted/60">Connect</h4>
              <div className="flex items-center gap-4 text-persona-muted/40">
                <FontAwesomeIcon icon={faUsers} className="h-5 w-5 hover:text-persona-primary cursor-pointer transition-colors" />
                <FontAwesomeIcon icon={faCompass} className="h-5 w-5 hover:text-persona-primary cursor-pointer transition-colors" />
                <FontAwesomeIcon icon={faMapLocationDot} className="h-5 w-5 hover:text-persona-primary cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-[#dde4e6]/60" />

        {/* Bottom Section: Policies and Copyright */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-persona-muted/70">
            {policyLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-persona-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-medium text-persona-muted/50 uppercase tracking-widest">
              © 2026 Sowon Local Trip. All rights reserved.
            </span>
            <Link
              href="/admin"
              title="관리자 페이지 (운영 전용)"
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-persona-primary/10 bg-white/50 px-3 text-[10px] font-black text-persona-muted transition hover:border-persona-primary/30 hover:bg-white hover:text-persona-primary"
            >
              <FontAwesomeIcon icon={faUser} className="h-3 w-3" />
              ADMIN
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
