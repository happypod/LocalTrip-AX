"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWishlist } from "@/context/wishlist-context";
import { PersonaThemeSwitcher } from "@/components/theme/persona-theme-switcher";
import { PersonaOnboardingDialog } from "@/components/theme/persona-onboarding-dialog";
import { usePersonaCopy } from "@/hooks/use-persona-copy";
import { useIsClient } from "@/hooks/use-is-client";
import { usePersonaThemeStore } from "@/store/persona-theme-store";
import { PersonaLanguageCode } from "@/lib/persona-theme";
import { cn } from "@/lib/utils";
import { getStaticLabels } from "@/lib/static-translations";
import {
  faClock,
  faHeart,
  faHouseChimney,
  faList,
  faLocationArrow,
  faMagnifyingGlass,
  faShoppingCart,
  faUser,
  faXmark,
} from "@/lib/fontawesome";
import { Footer } from "@/components/layout/footer";

interface LanguageItem {
  code: string;
  label: string;
  flag: string;
}

interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
  isPopular?: boolean;
}

const languages: LanguageItem[] = [
  { code: "ko", label: "한국어", flag: "KR" },
  { code: "en", label: "English", flag: "EN" },
  { code: "zh", label: "简体中文", flag: "CN" },
  { code: "ja", label: "日本語", flag: "JP" },
];

const currencies: CurrencyItem[] = [
  { code: "KRW", name: "대한민국 원", symbol: "₩", isPopular: true },
  { code: "AED", name: "아랍에미리트 디르함", symbol: "AED" },
  { code: "AZN", name: "아제르바이잔 마나트", symbol: "AZN" },
  { code: "AUD", name: "호주 달러", symbol: "AU$" },
  { code: "BHD", name: "바레인 디나르", symbol: "BHD" },
  { code: "BRL", name: "브라질 레알", symbol: "R$" },
  { code: "BYN", name: "벨라루스 루블", symbol: "BYN" },
  { code: "CAD", name: "캐나다 달러", symbol: "CA$" },
  { code: "CHF", name: "스위스 프랑", symbol: "CHF" },
  { code: "CLP", name: "칠레 페소", symbol: "CLP" },
  { code: "CNY", name: "중국 위안", symbol: "CNY" },
  { code: "COP", name: "콜롬비아 페소", symbol: "COP" },
  { code: "DKK", name: "덴마크 크로네", symbol: "DKK" },
  { code: "EUR", name: "유로", symbol: "€" },
  { code: "GBP", name: "영국 파운드", symbol: "£" },
  { code: "HKD", name: "홍콩 달러", symbol: "HK$" },
  { code: "IDR", name: "인도네시아 루피아", symbol: "IDR" },
  { code: "ILS", name: "이스라엘 뉴셰켈", symbol: "ILS" },
  { code: "INR", name: "인도 루피", symbol: "INR" },
  { code: "JOD", name: "요르단 디나르", symbol: "JOD" },
  { code: "JPY", name: "일본 엔", symbol: "¥" },
];

function isPublicChromeHidden(pathname: string) {
  return pathname.startsWith("/admin");
}

function LocaleCurrencyButton({
  selectedLang,
  selectedCurrency,
  onClick,
  className = "",
}: {
  selectedLang: LanguageItem;
  selectedCurrency: CurrencyItem;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="언어 및 통화 선택"
      className={`flex h-10 items-center gap-2 text-sm font-black tracking-tight text-[#2f3744] transition hover:text-[#111827] ${className}`}
    >
      <span className="text-[10px] font-black">{selectedLang.flag}</span>
      <span className="h-5 w-px bg-[#2f3744]" />
      <span>{selectedCurrency.code}</span>
    </button>
  );
}

function DesktopTopNav({
  pathname,
  selectedLang,
  selectedCurrency,
  brandTitle,
  onOpenSwitcher,
  onOpenWishlist,
}: {
  pathname: string;
  selectedLang: LanguageItem;
  selectedCurrency: CurrencyItem;
  brandTitle: string;
  onOpenSwitcher: () => void;
  onOpenWishlist: () => void;
}) {
  const { wishlist } = useWishlist();
  const currentLang = usePersonaThemeStore((state) => state.currentLang);
  const labels = getStaticLabels(currentLang);

  return (
    <header className="hidden md:block sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/" className="text-xl font-black tracking-tight text-[#111827]">
          {brandTitle}
        </Link>

        <nav aria-label="상단 유틸 메뉴" className="flex items-center gap-5 text-[15px] font-black text-[#2f3744]">
          <Link
            href="/customer-center"
            className={`transition hover:text-[#111827] ${pathname.startsWith("/customer-center") ? "text-[#111827]" : ""}`}
          >
            {labels.navCustomerCenter}
          </Link>
          
          <button 
            type="button" 
            onClick={onOpenWishlist}
            className="flex items-center gap-2 transition hover:text-[#111827] group relative cursor-pointer"
          >
            <div className="relative">
              <FontAwesomeIcon icon={faHeart} className={cn("h-4 w-4 text-[#566170] group-hover:text-[#ff4b4b] transition-colors", wishlist.length > 0 && "text-[#ff4b4b]")} />
              {wishlist.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-[#ae2f34] px-0.5 text-[8px] font-black text-white shadow-sm">
                  {wishlist.length > 99 ? "99+" : wishlist.length}
                </span>
              )}
            </div>
            <span>{labels.navWishlist}</span>
          </button>

          <button 
            type="button" 
            onClick={() => alert(labels.cartNotice)}
            className="flex items-center gap-2 transition hover:text-[#111827] cursor-pointer"
          >
            <FontAwesomeIcon icon={faShoppingCart} className="h-4 w-4 text-[#566170]" />
            <span>{labels.navCart}</span>
          </button>
          <button 
            type="button" 
            onClick={() => alert(labels.recentNotice)}
            className="flex items-center gap-2 transition hover:text-[#111827] cursor-pointer"
          >
            <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-[#566170]" />
            <span>{labels.navRecent}</span>
          </button>
          <LocaleCurrencyButton
            selectedLang={selectedLang}
            selectedCurrency={selectedCurrency}
            onClick={onOpenSwitcher}
            className="px-1"
          />
          <Link
            href="/my"
            className={cn(
              "flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-black text-[#2f3744] shadow-[0_3px_14px_rgba(15,23,42,0.12)] ring-1 ring-gray-100 transition hover:text-[#111827]",
              pathname.startsWith("/my") && "text-[#ae2f34]",
            )}
          >
            <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
            {labels.navMy}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function MobileTopNav({
  selectedLang,
  selectedCurrency,
  brandTitle,
  onOpenSwitcher,
}: {
  selectedLang: LanguageItem;
  selectedCurrency: CurrencyItem;
  brandTitle: string;
  onOpenSwitcher: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 flex h-12 items-center justify-between border-b border-gray-100 bg-white px-4 md:hidden">
      <Link href="/" className="text-xl font-black tracking-tight text-[#111827]">
        {brandTitle}
      </Link>
      <LocaleCurrencyButton selectedLang={selectedLang} selectedCurrency={selectedCurrency} onClick={onOpenSwitcher} />
    </header>
  );
}

function LocaleCurrencyModal({
  modalTab,
  selectedLang,
  selectedCurrency,
  onTabChange,
  onLangSelect,
  onCurrencySelect,
  onClose,
}: {
  modalTab: "lang" | "currency" | "theme";
  selectedLang: LanguageItem;
  selectedCurrency: CurrencyItem;
  onTabChange: (tab: "lang" | "currency" | "theme") => void;
  onLangSelect: (lang: LanguageItem) => void;
  onCurrencySelect: (currency: CurrencyItem) => void;
  onClose: () => void;
}) {
  const currentLang = usePersonaThemeStore((state) => state.currentLang);
  const labels = getStaticLabels(currentLang);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <div className="flex h-[min(550px,calc(100dvh-32px))] w-full max-w-[680px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 pb-3 pt-5">
          <div className="flex gap-6 text-base font-bold">
            <button
              type="button"
              onClick={() => onTabChange("lang")}
              className={`relative pb-2 ${
                modalTab === "lang" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {labels.modalLang}
            </button>
            <button
              type="button"
              onClick={() => onTabChange("currency")}
              className={`relative pb-2 ${
                modalTab === "currency" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {labels.modalCurrency}
            </button>
            <button
              type="button"
              onClick={() => onTabChange("theme")}
              className={`relative pb-2 ${
                modalTab === "theme" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {labels.modalTheme}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label={labels.modalClose}
          >
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {modalTab === "theme" ? (
            <div>
              <h4 className="mb-4 text-xs font-black uppercase tracking-wider text-gray-400">{labels.modalPersonaTitle}</h4>
              <div className="py-2">
                <PersonaThemeSwitcher />
              </div>
            </div>
          ) : modalTab === "lang" ? (
            <div>
              <h4 className="mb-4 text-xs font-black uppercase tracking-wider text-gray-400">{labels.modalAllLang}</h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {languages.map((lang) => {
                  const isSelected = selectedLang.code === lang.code;

                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => onLangSelect(lang)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-xs font-bold transition-all ${
                        isSelected ? "bg-gray-100 text-[#ae2f34] ring-1 ring-gray-200" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="w-7 shrink-0 text-sm font-black text-gray-500">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h4 className="mb-3 text-xs font-black uppercase tracking-wider text-gray-400">{labels.modalPopularCurrency}</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {currencies
                    .filter((currency) => currency.isPopular)
                    .map((currency) => {
                      const isSelected = selectedCurrency.code === currency.code;

                      return (
                        <button
                          key={currency.code}
                          type="button"
                          onClick={() => onCurrencySelect(currency)}
                          className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-xs font-bold transition-all ${
                            isSelected ? "bg-gray-100 text-[#ae2f34] ring-1 ring-gray-200" : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="font-extrabold text-blue-600">{currency.code}</span>
                          <span className="text-gray-400">-</span>
                          <span>
                            {currency.name} ({currency.symbol})
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-xs font-black uppercase tracking-wider text-gray-400">{labels.modalAllCurrency}</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {currencies.map((currency) => {
                    const isSelected = selectedCurrency.code === currency.code;

                    return (
                      <button
                        key={currency.code}
                        type="button"
                        onClick={() => onCurrencySelect(currency)}
                        className={`flex min-w-0 items-center gap-3 rounded-2xl px-4 py-3 text-left text-xs font-bold transition-all ${
                          isSelected ? "bg-gray-100 text-[#ae2f34] ring-1 ring-gray-200" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="shrink-0 font-extrabold text-blue-600">{currency.code}</span>
                        <span className="shrink-0 text-gray-400">-</span>
                        <span className="truncate">
                          {currency.name} ({currency.symbol})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileBottomNav({
  pathname,
  labels,
  isCategoryOpen,
  setIsCategoryOpen,
  onOpenWishlist,
}: {
  pathname: string;
  labels: {
    category: string;
    nearby: string;
    home: string;
    wishlist: string;
    my: string;
  };
  isCategoryOpen: boolean;
  setIsCategoryOpen: (open: boolean) => void;
  onOpenWishlist: () => void;
}) {
  const { wishlist } = useWishlist();
  
  const bottomItems = [
    {
      kind: "category" as const,
      label: labels.category,
      icon: faList,
    },
    {
      kind: "link" as const,
      href: "/map",
      label: labels.nearby,
      icon: faLocationArrow,
      match: (path: string) => path.startsWith("/map") && !isCategoryOpen,
    },
    {
      kind: "link" as const,
      href: "/",
      label: labels.home,
      icon: faHouseChimney,
      match: (path: string) => path === "/" && !isCategoryOpen,
    },
    {
      kind: "button" as const,
      label: labels.wishlist,
      icon: faHeart,
      action: onOpenWishlist,
    },
    {
      kind: "link" as const,
      href: "/my",
      label: labels.my,
      icon: faUser,
      match: (path: string) => path.startsWith("/my") && !isCategoryOpen,
    },
  ];

  return (
    <nav
      aria-label="모바일 주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-50 grid h-[calc(64px+env(safe-area-inset-bottom))] grid-cols-5 border-t border-gray-100 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl md:hidden"
    >
      {bottomItems.map((item) => {
        if (item.kind === "category") {
          const isActive = isCategoryOpen;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              aria-label={item.label}
              title={item.label}
              className={`flex h-16 items-center justify-center rounded-lg transition ${
                isActive ? "text-[#ae2f34]" : "text-[#2f3744] active:text-[#111827]"
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className={`h-7 w-7 transition-transform ${isActive ? "scale-110" : ""}`} />
            </button>
          );
        }

        if (item.kind === "button") {
          const isWishlist = item.label === labels.wishlist;
          return (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              aria-label={item.label}
              title={item.label}
              className="flex h-16 items-center justify-center rounded-lg text-[#2f3744] transition active:text-[#111827]"
            >
              <div className="relative">
                <FontAwesomeIcon icon={item.icon} className={cn("h-7 w-7 transition-transform", isWishlist && wishlist.length > 0 && "text-[#ff4b4b]")} />
                {isWishlist && wishlist.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ae2f34] px-1 text-[8px] font-black leading-none text-white">
                    {wishlist.length}
                  </span>
                )}
              </div>
            </button>
          );
        }

        const isActive = item.match(pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsCategoryOpen(false)}
            aria-current={isActive ? "page" : undefined}
            aria-label={item.label}
            title={item.label}
            className={`flex h-16 items-center justify-center rounded-lg transition ${
              isActive ? "text-[#ae2f34]" : "text-[#2f3744] active:text-[#111827]"
            }`}
          >
            <FontAwesomeIcon icon={item.icon} className={`h-7 w-7 transition-transform ${isActive ? "scale-110" : ""}`} />
          </Link>
        );
      })}
    </nav>
  );
}

function CategoryOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const copy = usePersonaCopy();
  const currentLang = usePersonaThemeStore((state) => state.currentLang);
  const labels = getStaticLabels(currentLang);
  const categoryLinkClass = "hover:text-[#ae2f34]";
  const categoryTagClass =
    "rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-[#ae2f34] hover:text-[#ae2f34]";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-[#f8fafc] pb-[88px] pt-4 md:hidden">
      <div className="px-4">
        {/* Search Bar */}
        <div className="relative mb-6 mt-2">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4" />
          </span>
          <input
            type="text"
            aria-label={labels.searchMenuPlaceholder}
            placeholder={labels.searchMenuPlaceholder}
            className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-gray-700 shadow-sm focus:border-[#ae2f34] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ae2f34]"
          />
        </div>

        {/* Section 1: Stays (소원머묾) */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-1.5 px-1">
            <span className="text-sm">🏨</span>
            <span className="text-sm font-black text-gray-800 font-persona-display">{copy.nav.stay} ({labels.navStayTag})</span>
          </div>
          <div className="rounded-3xl border border-gray-100/50 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-y-4 text-sm font-bold text-gray-800">
              {labels.categoryOverlayStayItems.map((label) => (
                <Link key={label} href="/stays" onClick={onClose} className={categoryLinkClass}>
                  {label}
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-gray-50">
              {labels.categoryOverlayStayTags.map((label) => (
                <Link key={label} href="/stays" onClick={onClose} className={categoryTagClass}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Experiences (인기노님) */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-1.5 px-1">
            <span className="text-sm">🏄</span>
            <span className="text-sm font-black text-gray-800 font-persona-display">{copy.nav.experience} ({labels.navExpTag})</span>
          </div>
          <div className="rounded-3xl border border-gray-100/50 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-y-4 text-sm font-bold text-gray-800">
              {labels.categoryOverlayExperienceItems.map((label) => (
                <Link key={label} href="/experiences" onClick={onClose} className={categoryLinkClass}>
                  {label}
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-gray-50">
              {labels.categoryOverlayExperienceTags.map((label) => (
                <Link key={label} href="/experiences" onClick={onClose} className={categoryTagClass}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Programs (소원별미) */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-1.5 px-1">
            <span className="text-sm">🍤</span>
            <span className="text-sm font-black text-gray-800 font-persona-display">{copy.nav.localProduct} ({labels.navProgTag})</span>
          </div>
          <div className="rounded-3xl border border-gray-100/50 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-y-4 text-sm font-bold text-gray-800">
              {labels.categoryOverlayProgramItems.map((label) => (
                <Link key={label} href="/programs" onClick={onClose} className={categoryLinkClass}>
                  {label}
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-gray-50">
              {labels.categoryOverlayProgramTags.map((label) => (
                <Link key={label} href="/programs" onClick={onClose} className={categoryTagClass}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Courses (추천여정) */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-1.5 px-1">
            <span className="text-sm">🗺️</span>
            <span className="text-sm font-black text-gray-800 font-persona-display">{copy.nav.course} ({labels.navCourseTag})</span>
          </div>
          <div className="rounded-3xl border border-gray-100/50 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-y-4 text-sm font-bold text-gray-800">
              {labels.categoryOverlayCourseItems.map((label) => (
                <Link key={label} href="/courses" onClick={onClose} className={categoryLinkClass}>
                  {label}
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-gray-50">
              {labels.categoryOverlayCourseTags.map((label, index) => (
                <Link key={label} href={index === 1 ? "/map" : "/courses"} onClick={onClose} className={categoryTagClass}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function WishlistDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { wishlist, removeItem } = useWishlist();
  const currentLang = usePersonaThemeStore((state) => state.currentLang);
  const labels = getStaticLabels(currentLang);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Slide Panel */}
      <div className="fixed inset-y-0 right-0 z-[70] w-full max-w-[360px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 sm:w-[400px]">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 bg-white">
            <div className="flex items-center gap-2 font-black text-lg text-gray-900">
              <FontAwesomeIcon icon={faHeart} className="text-[#ff4b4b] h-4 w-4" />
              <span>{labels.wishlistTitle} ({wishlist.length})</span>
            </div>
            <button 
              type="button"
              onClick={onClose} 
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition"
            >
              <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content Scrollable List */}
          <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-4">
            {wishlist.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center px-4">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#dde4e6] shadow-inner text-3xl">
                   <FontAwesomeIcon icon={faHeart} />
                </div>
                <p className="text-lg font-extrabold text-[#2f3744]">{labels.wishlistEmpty}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 font-medium">
                  {labels.wishlistEmptyDesc}
                </p>
                <button 
                  type="button"
                  onClick={onClose} 
                  className="mt-8 rounded-full bg-[#2f3744] px-6 py-3 text-sm font-bold text-white shadow-lg active:scale-95 transition"
                >
                  {labels.wishlistExplore}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {wishlist.map((item) => (
                  <div 
                    key={item.href} 
                    className="group relative flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:shadow-md"
                  >
                    {/* Thumbnail */}
                    <Link href={item.href} onClick={onClose} className="relative aspect-[1.3] h-[72px] w-[96px] flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {item.imageUrl ? (
                         <Image 
                           src={item.imageUrl} 
                           alt={item.title} 
                           fill 
                           className="object-cover group-hover:scale-105 transition-transform duration-500" 
                         />
                      ) : (
                         <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400 font-medium">이미지 없음</div>
                      )}
                    </Link>
                    
                    {/* Text details */}
                    <div className="flex flex-1 flex-col justify-center pr-4">
                       {item.badge && (
                         <span className="mb-1 text-[10px] font-bold text-gray-400">{item.badge}</span>
                       )}
                       <Link 
                         href={item.href} 
                         onClick={onClose} 
                         className="line-clamp-1 text-sm font-bold text-[#2f3744] hover:text-[#ae2f34] transition-colors"
                       >
                         {item.title}
                       </Link>
                       {item.priceText ? (
                         <p className="mt-1 text-[13px] font-black text-[#ae2f34]">{item.priceText}</p>
                       ) : (
                         <p className="mt-1 text-[13px] font-medium text-gray-400">{labels.infoLoading}</p>
                       )}
                    </div>

                    {/* Delete action */}
                    <button 
                      type="button"
                      onClick={() => removeItem(item.href)} 
                      className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 shadow-sm opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-200"
                      title={labels.wishlistDelete}
                    >
                       <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer (Bottom actions) */}
          {wishlist.length > 0 && (
            <div className="border-t border-gray-100 bg-white p-4">
              <button 
                type="button"
                onClick={onClose} 
                className="w-full rounded-xl bg-[#ae2f34] py-4 text-sm font-extrabold text-white shadow-md active:scale-[0.98] transition-transform"
              >
                {labels.wishlistContinue}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function PublicNavigationShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const copy = usePersonaCopy();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"lang" | "currency" | "theme">("lang");
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyItem>(currencies[0]);

  const currentLang = usePersonaThemeStore((state) => state.currentLang);
  const setLang = usePersonaThemeStore((state) => state.setLang);
  const labels = getStaticLabels(currentLang);
  const isClient = useIsClient();
  const effectiveLang = isClient ? currentLang : "ko";
  const mappedCode = effectiveLang === "zh-cn" ? "zh" : effectiveLang === "ja-jp" ? "ja" : effectiveLang;
  const selectedLang = languages.find((l) => l.code === mappedCode) || languages[0];

  if (isPublicChromeHidden(pathname)) {
    return <>{children}</>;
  }

  const openSwitcher = () => {
    setModalTab("lang");
    setIsSwitcherOpen(true);
  };

  const handleLangSelect = (lang: LanguageItem) => {
    const mappedStoreCode = lang.code === "zh" ? "zh-cn" : lang.code === "ja" ? "ja-jp" : (lang.code as PersonaLanguageCode);
    setLang(mappedStoreCode);
    setIsSwitcherOpen(false);
    router.refresh(); // Refresh server components to re-read locale cookie
  };

  return (
    <>
      <DesktopTopNav
        pathname={pathname}
        selectedLang={selectedLang}
        selectedCurrency={selectedCurrency}
        brandTitle={copy.hero.title}
        onOpenSwitcher={openSwitcher}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />
      {!isCategoryOpen && (
        <MobileTopNav
          selectedLang={selectedLang}
          selectedCurrency={selectedCurrency}
          brandTitle={copy.hero.title}
          onOpenSwitcher={openSwitcher}
        />
      )}

      {isCategoryOpen ? (
        <CategoryOverlay isOpen={isCategoryOpen} onClose={() => setIsCategoryOpen(false)} />
      ) : (
        <>
          {children}
          <Footer />
          <div aria-hidden="true" className="h-20 md:hidden" />
        </>
      )}

      <MobileBottomNav
        pathname={pathname}
        labels={{
          category: `${copy.nav.stay}/${copy.nav.experience}/${copy.nav.localProduct}/${copy.nav.course}`,
          nearby: copy.button.openMap,
          home: copy.hero.title,
          wishlist: labels.navWishlist,
          my: labels.navMy,
        }}
        isCategoryOpen={isCategoryOpen}
        setIsCategoryOpen={setIsCategoryOpen}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />
      
      <WishlistDrawer 
        isOpen={isWishlistOpen} 
        onClose={() => setIsWishlistOpen(false)} 
      />

      <PersonaOnboardingDialog />

      {isSwitcherOpen && (
        <LocaleCurrencyModal
          modalTab={modalTab}
          selectedLang={selectedLang}
          selectedCurrency={selectedCurrency}
          onTabChange={setModalTab}
          onLangSelect={handleLangSelect}
          onCurrencySelect={(currency) => {
            setSelectedCurrency(currency);
            setIsSwitcherOpen(false);
          }}
          onClose={() => setIsSwitcherOpen(false)}
        />
      )}
    </>
  );
}
