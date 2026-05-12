"use client";

import { useState, type ReactNode } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWishlist } from "@/context/wishlist-context";
import { cn } from "@/lib/utils";
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

type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: IconDefinition;
  match: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  {
    href: "/",
    label: "홈",
    shortLabel: "홈",
    icon: faHouseChimney,
    match: (pathname) => pathname === "/",
  },
  {
    href: "/stays",
    label: "카테고리",
    shortLabel: "카테고리",
    icon: faList,
    match: (pathname) =>
      pathname.startsWith("/stays") ||
      pathname.startsWith("/experiences") ||
      pathname.startsWith("/programs") ||
      pathname.startsWith("/courses"),
  },
  {
    href: "/map",
    label: "내주변",
    shortLabel: "내주변",
    icon: faLocationArrow,
    match: (pathname) => pathname.startsWith("/map"),
  },
];

const languages: LanguageItem[] = [
  { code: "ko", label: "한국어", flag: "KR" },
  { code: "zh", label: "繁體中文", flag: "繁" },
  { code: "ja", label: "日本語", flag: "JP" },
  { code: "th", label: "ภาษาไทย", flag: "TH" },
  { code: "uk", label: "Українська", flag: "UA" },
  { code: "ar", label: "العربية", flag: "AR" },
  { code: "id", label: "Bahasa Indonesia", flag: "ID" },
  { code: "ms", label: "Bahasa Melayu", flag: "MY" },
  { code: "da", label: "Dansk", flag: "DK" },
  { code: "de", label: "Deutsch", flag: "DE" },
  { code: "en", label: "English", flag: "EN" },
  { code: "es", label: "Español", flag: "ES" },
  { code: "fr", label: "Français", flag: "FR" },
  { code: "it", label: "Italiano", flag: "IT" },
  { code: "nl", label: "Nederlands", flag: "NL" },
  { code: "pl", label: "Polski", flag: "PL" },
  { code: "pt", label: "Português (Brasil)", flag: "BR" },
  { code: "fi", label: "Suomi", flag: "FI" },
  { code: "sv", label: "Svenska", flag: "SE" },
  { code: "vi", label: "Tiếng Việt", flag: "VN" },
  { code: "tr", label: "Türkçe", flag: "TR" },
  { code: "el", label: "Ελληνικά", flag: "GR" },
  { code: "ru", label: "Русский", flag: "RU" },
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
  onOpenSwitcher,
  onOpenWishlist,
}: {
  pathname: string;
  selectedLang: LanguageItem;
  selectedCurrency: CurrencyItem;
  onOpenSwitcher: () => void;
  onOpenWishlist: () => void;
}) {
  const { wishlist } = useWishlist();

  return (
    <header className="hidden md:block sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/" className="text-xl font-black tracking-tight text-[#111827]">
          소원머묾
        </Link>

        <nav aria-label="상단 유틸 메뉴" className="flex items-center gap-5 text-[15px] font-black text-[#2f3744]">
          <Link
            href="/customer-center"
            className={`transition hover:text-[#111827] ${pathname.startsWith("/customer-center") ? "text-[#111827]" : ""}`}
          >
            고객센터
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
            <span>찜</span>
          </button>

          <button type="button" className="flex items-center gap-2 transition hover:text-[#111827]">
            <FontAwesomeIcon icon={faShoppingCart} className="h-4 w-4 text-[#566170]" />
            <span>장바구니</span>
          </button>
          <button type="button" className="flex items-center gap-2 transition hover:text-[#111827]">
            <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-[#566170]" />
            <span>최근 본 상품</span>
          </button>
          <LocaleCurrencyButton
            selectedLang={selectedLang}
            selectedCurrency={selectedCurrency}
            onClick={onOpenSwitcher}
            className="px-1"
          />
          <Link
            href="/admin"
            className="flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-black text-[#2f3744] shadow-[0_3px_14px_rgba(15,23,42,0.12)] ring-1 ring-gray-100 transition hover:text-[#111827]"
          >
            <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
            마이
          </Link>
        </nav>
      </div>
    </header>
  );
}

function MobileTopNav({
  selectedLang,
  selectedCurrency,
  onOpenSwitcher,
}: {
  selectedLang: LanguageItem;
  selectedCurrency: CurrencyItem;
  onOpenSwitcher: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 flex h-12 items-center justify-between border-b border-gray-100 bg-white px-4 md:hidden">
      <Link href="/" className="text-xl font-black tracking-tight text-[#111827]">
        소원머묾
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
  modalTab: "lang" | "currency";
  selectedLang: LanguageItem;
  selectedCurrency: CurrencyItem;
  onTabChange: (tab: "lang" | "currency") => void;
  onLangSelect: (lang: LanguageItem) => void;
  onCurrencySelect: (currency: CurrencyItem) => void;
  onClose: () => void;
}) {
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
              언어
            </button>
            <button
              type="button"
              onClick={() => onTabChange("currency")}
              className={`relative pb-2 ${
                modalTab === "currency" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              통화
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="닫기"
          >
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {modalTab === "lang" ? (
            <div>
              <h4 className="mb-4 text-xs font-black uppercase tracking-wider text-gray-400">모든 언어</h4>
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
                <h4 className="mb-3 text-xs font-black uppercase tracking-wider text-gray-400">주요 통화</h4>
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
                <h4 className="mb-3 text-xs font-black uppercase tracking-wider text-gray-400">모든 통화</h4>
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
  isCategoryOpen,
  setIsCategoryOpen,
  onOpenWishlist,
}: {
  pathname: string;
  isCategoryOpen: boolean;
  setIsCategoryOpen: (open: boolean) => void;
  onOpenWishlist: () => void;
}) {
  const { wishlist } = useWishlist();
  
  const bottomItems = [
    {
      kind: "category" as const,
      label: "카테고리",
      shortLabel: "카테고리",
      icon: faList,
    },
    {
      kind: "link" as const,
      href: "/map",
      label: "내주변",
      shortLabel: "내주변",
      icon: faLocationArrow,
      match: (path: string) => path.startsWith("/map") && !isCategoryOpen,
    },
    {
      kind: "link" as const,
      href: "/",
      label: "홈",
      shortLabel: "홈",
      icon: faHouseChimney,
      match: (path: string) => path === "/" && !isCategoryOpen,
    },
    {
      kind: "button" as const,
      label: "찜",
      shortLabel: "찜",
      icon: faHeart,
      action: onOpenWishlist,
    },
    {
      kind: "link" as const,
      href: "/admin",
      label: "마이",
      shortLabel: "마이",
      icon: faUser,
      match: (path: string) => path.startsWith("/admin") && !isCategoryOpen,
    },
  ];

  return (
    <nav
      aria-label="모바일 주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-50 grid h-[72px] grid-cols-5 border-t border-gray-100 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0px)] shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl md:hidden"
    >
      {bottomItems.map((item) => {
        if (item.kind === "category") {
          const isActive = isCategoryOpen;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-black tracking-tight transition ${
                isActive ? "text-[#ae2f34]" : "text-[#2f3744] active:text-[#111827]"
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className={`h-[18px] w-[18px] ${isActive ? "scale-110" : ""}`} />
              <span>{item.shortLabel}</span>
            </button>
          );
        }

        if (item.kind === "button") {
          const isWishlist = item.label === "찜";
          return (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-black tracking-tight text-[#2f3744] transition active:text-[#111827]"
            >
              <div className="relative">
                <FontAwesomeIcon icon={item.icon} className={cn("h-[18px] w-[18px] transition", isWishlist && wishlist.length > 0 && "text-[#ff4b4b]")} />
                {isWishlist && wishlist.length > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-3 min-w-[12px] items-center justify-center rounded-full bg-[#ae2f34] px-0.5 text-[7px] font-black text-white">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span>{item.shortLabel}</span>
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
            className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-black tracking-tight transition ${
              isActive ? "text-[#ae2f34]" : "text-[#2f3744] active:text-[#111827]"
            }`}
          >
            <FontAwesomeIcon icon={item.icon} className={`h-[18px] w-[18px] ${isActive ? "scale-110" : ""}`} />
            <span>{item.shortLabel}</span>
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
            placeholder="검색어를 입력하세요"
            className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-gray-700 shadow-sm focus:border-[#ae2f34] focus:outline-none"
          />
        </div>

        {/* Section 1: Stays (소원머묾) */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-1.5 px-1">
            <span className="text-sm">🏨</span>
            <span className="text-sm font-black text-gray-800">소원머묾 (숙박)</span>
          </div>
          <div className="rounded-3xl border border-gray-100/50 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-y-4 text-sm font-bold text-gray-800">
              <Link href="/stays" onClick={onClose} className="hover:text-[#ae2f34]">한옥/전통가옥</Link>
              <Link href="/stays" onClick={onClose} className="hover:text-[#ae2f34]">독채/감성숙소</Link>
              <Link href="/stays" onClick={onClose} className="hover:text-[#ae2f34]">펜션/풀빌라</Link>
              <Link href="/stays" onClick={onClose} className="hover:text-[#ae2f34]">카라반/글램핑</Link>
              <Link href="/stays" onClick={onClose} className="hover:text-[#ae2f34]">게스트하우스</Link>
              <Link href="/stays" onClick={onClose} className="hover:text-[#ae2f34]">전통민박/가족형</Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-gray-50">
              <Link href="/stays" onClick={onClose} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-[#ae2f34] hover:text-[#ae2f34]">인기 머묾</Link>
              <Link href="/stays" onClick={onClose} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-[#ae2f34] hover:text-[#ae2f34]">초특가 숙소</Link>
              <Link href="/stays" onClick={onClose} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-[#ae2f34] hover:text-[#ae2f34]">전통 한옥</Link>
            </div>
          </div>
        </div>

        {/* Section 2: Experiences (인기노님) */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-1.5 px-1">
            <span className="text-sm">🏄</span>
            <span className="text-sm font-black text-gray-800">인기노님 (체험)</span>
          </div>
          <div className="rounded-3xl border border-gray-100/50 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-y-4 text-sm font-bold text-gray-800">
              <Link href="/experiences" onClick={onClose} className="hover:text-[#ae2f34]">바다 서핑</Link>
              <Link href="/experiences" onClick={onClose} className="hover:text-[#ae2f34]">해안 생태체험</Link>
              <Link href="/experiences" onClick={onClose} className="hover:text-[#ae2f34]">염전 소금만들기</Link>
              <Link href="/experiences" onClick={onClose} className="hover:text-[#ae2f34]">해안 트레킹</Link>
              <Link href="/experiences" onClick={onClose} className="hover:text-[#ae2f34]">바다 낚시 투어</Link>
              <Link href="/experiences" onClick={onClose} className="hover:text-[#ae2f34]">원데이 공예클래스</Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-gray-50">
              <Link href="/experiences" onClick={onClose} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-[#ae2f34] hover:text-[#ae2f34]">액티비티</Link>
              <Link href="/experiences" onClick={onClose} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-[#ae2f34] hover:text-[#ae2f34]">가족 체험</Link>
              <Link href="/experiences" onClick={onClose} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-[#ae2f34] hover:text-[#ae2f34]">힐링 투어</Link>
            </div>
          </div>
        </div>

        {/* Section 3: Programs (소원별미) */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-1.5 px-1">
            <span className="text-sm">🍤</span>
            <span className="text-sm font-black text-gray-800">소원별미 (미식/프로그램)</span>
          </div>
          <div className="rounded-3xl border border-gray-100/50 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-y-4 text-sm font-bold text-gray-800">
              <Link href="/programs" onClick={onClose} className="hover:text-[#ae2f34]">대하/꽃게 구이</Link>
              <Link href="/programs" onClick={onClose} className="hover:text-[#ae2f34]">감태 떡만들기</Link>
              <Link href="/programs" onClick={onClose} className="hover:text-[#ae2f34]">로컬 어촌 밥상</Link>
              <Link href="/programs" onClick={onClose} className="hover:text-[#ae2f34]">제철 수산 미식</Link>
              <Link href="/programs" onClick={onClose} className="hover:text-[#ae2f34]">전통주 페어링</Link>
              <Link href="/programs" onClick={onClose} className="hover:text-[#ae2f34]">해산물 바비큐</Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-gray-50">
              <Link href="/programs" onClick={onClose} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-[#ae2f34] hover:text-[#ae2f34]">로컬푸드</Link>
              <Link href="/programs" onClick={onClose} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-[#ae2f34] hover:text-[#ae2f34]">제철 먹거리</Link>
              <Link href="/programs" onClick={onClose} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-[#ae2f34] hover:text-[#ae2f34]">미식 기행</Link>
            </div>
          </div>
        </div>

        {/* Section 4: Courses (추천여정) */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-1.5 px-1">
            <span className="text-sm">🗺️</span>
            <span className="text-sm font-black text-gray-800">추천여정 (코스)</span>
          </div>
          <div className="rounded-3xl border border-gray-100/50 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-y-4 text-sm font-bold text-gray-800">
              <Link href="/courses" onClick={onClose} className="hover:text-[#ae2f34]">당일치기 쉼표코스</Link>
              <Link href="/courses" onClick={onClose} className="hover:text-[#ae2f34]">1박2일 감성코스</Link>
              <Link href="/courses" onClick={onClose} className="hover:text-[#ae2f34]">어촌 살아보기 코스</Link>
              <Link href="/courses" onClick={onClose} className="hover:text-[#ae2f34]">가족 중심 맞춤여행</Link>
              <Link href="/courses" onClick={onClose} className="hover:text-[#ae2f34]">연인 전용 데이트코스</Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-gray-50">
              <Link href="/courses" onClick={onClose} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-[#ae2f34] hover:text-[#ae2f34]">추천 코스</Link>
              <Link href="/map" onClick={onClose} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 hover:border-[#ae2f34] hover:text-[#ae2f34]">지도 탐색</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function WishlistDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { wishlist, removeItem } = useWishlist();

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
              <span>찜한 여행 ({wishlist.length})</span>
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
                <p className="text-lg font-extrabold text-[#2f3744]">찜한 목록이 없습니다</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 font-medium">
                  마음에 드는 로컬 숙소나 체험을 발견하면<br />
                  하트를 꾹 눌러 담아보세요!
                </p>
                <button 
                  type="button"
                  onClick={onClose} 
                  className="mt-8 rounded-full bg-[#2f3744] px-6 py-3 text-sm font-bold text-white shadow-lg active:scale-95 transition"
                >
                  여행지 구경가기
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
                         <p className="mt-1 text-[13px] font-medium text-gray-400">정보 확인 중</p>
                       )}
                    </div>

                    {/* Delete action */}
                    <button 
                      type="button"
                      onClick={() => removeItem(item.href)} 
                      className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 shadow-sm opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-200"
                      title="찜 삭제"
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
                계속 둘러보기
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
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"lang" | "currency">("lang");
  const [selectedLang, setSelectedLang] = useState<LanguageItem>(languages[0]);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyItem>(currencies[0]);

  if (isPublicChromeHidden(pathname)) {
    return <>{children}</>;
  }

  const openSwitcher = () => {
    setModalTab("lang");
    setIsSwitcherOpen(true);
  };

  return (
    <>
      <DesktopTopNav
        pathname={pathname}
        selectedLang={selectedLang}
        selectedCurrency={selectedCurrency}
        onOpenSwitcher={openSwitcher}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />
      {!isCategoryOpen && (
        <MobileTopNav selectedLang={selectedLang} selectedCurrency={selectedCurrency} onOpenSwitcher={openSwitcher} />
      )}

      {isCategoryOpen ? (
        <CategoryOverlay isOpen={isCategoryOpen} onClose={() => setIsCategoryOpen(false)} />
      ) : (
        <>
          {children}
          <div aria-hidden="true" className="h-20 md:hidden" />
        </>
      )}

      <MobileBottomNav
        pathname={pathname}
        isCategoryOpen={isCategoryOpen}
        setIsCategoryOpen={setIsCategoryOpen}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />
      
      <WishlistDrawer 
        isOpen={isWishlistOpen} 
        onClose={() => setIsWishlistOpen(false)} 
      />

      {isSwitcherOpen && (
        <LocaleCurrencyModal
          modalTab={modalTab}
          selectedLang={selectedLang}
          selectedCurrency={selectedCurrency}
          onTabChange={setModalTab}
          onLangSelect={(lang) => {
            setSelectedLang(lang);
            setIsSwitcherOpen(false);
          }}
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
