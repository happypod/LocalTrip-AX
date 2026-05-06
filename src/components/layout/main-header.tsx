"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faHeart,
  faHouseChimney,
  faList,
  faLocationArrow,
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

export function MainHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"lang" | "currency">("lang");
  const [selectedLang, setSelectedLang] = useState<LanguageItem>({
    code: "ko",
    label: "한국어",
    flag: "🇰🇷",
  });
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyItem>({
    code: "KRW",
    name: "대한민국 원",
    symbol: "₩",
  });

  const languages: LanguageItem[] = [
    { code: "ko", label: "한국어", flag: "🇰🇷" },
    { code: "zh", label: "繁體中文", flag: "繁" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
    { code: "th", label: "ภาษาไทย", flag: "🇹🇭" },
    { code: "uk", label: "Українська", flag: "🇺🇦" },
    { code: "ar", label: "العربية", flag: "🌐" },
    { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" },
    { code: "da", label: "Dansk", flag: "🇩🇰" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "en", label: "English", flag: "🌐" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "it", label: "Italiano", flag: "🇮🇹" },
    { code: "nl", label: "Nederlands", flag: "🇳🇱" },
    { code: "pl", label: "Polski", flag: "🇵🇱" },
    { code: "pt", label: "Português (Brasil)", flag: "🇧🇷" },
    { code: "fi", label: "Suomi", flag: "🇫🇮" },
    { code: "sv", label: "Svenska", flag: "🇸🇪" },
    { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
    { code: "el", label: "Ελληνικά", flag: "🇬🇷" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
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

  const handleLangSelect = (lang: LanguageItem) => {
    setSelectedLang(lang);
    setIsModalOpen(false);
  };

  const handleCurrencySelect = (currency: CurrencyItem) => {
    setSelectedCurrency(currency);
    setIsModalOpen(false);
  };

  return (
    <>
      <header className="w-full bg-white/95 border-b border-gray-100 sticky top-0 z-40 backdrop-blur shadow-sm">
        <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between gap-4">
          {/* Logo - Visible on both mobile and desktop */}
          <Link href="/" className="text-xl font-black tracking-tight text-gray-900 shrink-0">
            소원머묾
          </Link>

          {/* Actions Row */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-gray-700">
            {/* Customer Center (고객센터) - Integrated on the right (hidden on mobile) */}
            <Link href="/customer-center" className="hidden md:block hover:text-[#ae2f34] transition text-gray-500 shrink-0">
              고객센터
            </Link>

            {/* Wishlist (찜) - Hidden on mobile, visible on desktop */}
            <button className="hidden md:flex items-center gap-1.5 hover:text-[#ae2f34] transition shrink-0">
              <FontAwesomeIcon icon={faHeart} className="h-4 w-4 text-gray-500 hover:text-red-500" />
              <span>찜</span>
            </button>

            {/* Cart (장바구니) - Hidden on mobile, visible on desktop */}
            <button className="hidden md:flex items-center gap-1.5 hover:text-[#ae2f34] transition shrink-0">
              <FontAwesomeIcon icon={faShoppingCart} className="h-4 w-4 text-gray-500" />
              <span>장바구니</span>
            </button>

            {/* Recently Viewed (최근 본 상품) - Hidden on mobile, visible on desktop */}
            <button className="hidden md:flex items-center gap-1.5 hover:text-[#ae2f34] transition shrink-0">
              <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-gray-500" />
              <span>최근 본 상품</span>
            </button>

            {/* Language/Currency switcher button - Always visible */}
            <button
              onClick={() => {
                setModalTab("lang");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 hover:text-[#ae2f34] transition font-black text-xs sm:text-sm shrink-0"
            >
              <span className="text-sm">{selectedLang.flag}</span>
              <span>|</span>
              <span>{selectedCurrency.code}</span>
            </button>

            {/* My Page (마이) - Hidden on mobile (since it is on the bottom nav), visible on desktop */}
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gray-50 hover:bg-gray-100 transition shadow-sm border border-gray-100/50 text-xs sm:text-sm shrink-0"
            >
              <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-gray-600" />
              <span>마이</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Bottom Navigation (하단 네비) - Only visible on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 border-t border-gray-100/80 h-16 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] backdrop-blur flex items-center justify-around px-3 pb-safe">
        {/* 카테고리 */}
        <Link href="/stays" className="flex flex-col items-center justify-center flex-1 py-1 text-gray-700 hover:text-[#ae2f34] active:text-[#ae2f34] transition">
          <FontAwesomeIcon icon={faList} className="h-[18px] w-[18px] mb-1" />
          <span className="text-[10px] font-bold tracking-tight">카테고리</span>
        </Link>

        {/* 내주변 */}
        <Link href="/map" className="flex flex-col items-center justify-center flex-1 py-1 text-gray-700 hover:text-[#ae2f34] active:text-[#ae2f34] transition">
          <FontAwesomeIcon icon={faLocationArrow} className="h-[18px] w-[18px] mb-1 -rotate-45" />
          <span className="text-[10px] font-bold tracking-tight">내주변</span>
        </Link>

        {/* 홈 */}
        <Link href="/" className="flex flex-col items-center justify-center flex-1 py-1 text-gray-900 hover:text-[#ae2f34] active:text-[#ae2f34] transition">
          <FontAwesomeIcon icon={faHouseChimney} className="h-[20px] w-[20px] mb-1 text-gray-900" />
          <span className="text-[10px] font-black tracking-tight">홈</span>
        </Link>

        {/* 찜 */}
        <button className="flex flex-col items-center justify-center flex-1 py-1 text-gray-700 hover:text-[#ae2f34] active:text-[#ae2f34] transition">
          <FontAwesomeIcon icon={faHeart} className="h-[18px] w-[18px] mb-1" />
          <span className="text-[10px] font-bold tracking-tight">찜</span>
        </button>

        {/* 마이 */}
        <Link href="/admin" className="flex flex-col items-center justify-center flex-1 py-1 text-gray-700 hover:text-[#ae2f34] active:text-[#ae2f34] transition">
          <FontAwesomeIcon icon={faUser} className="h-[18px] w-[18px] mb-1" />
          <span className="text-[10px] font-bold tracking-tight">마이</span>
        </Link>
      </nav>

      {/* Language / Currency Switcher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[680px] h-[550px] flex flex-col shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Tabs Header */}
            <div className="flex items-center justify-between border-b px-6 pt-5 pb-3">
              <div className="flex gap-6 text-base font-bold">
                <button
                  onClick={() => setModalTab("lang")}
                  className={`pb-2 relative ${
                    modalTab === "lang"
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  언어
                </button>
                <button
                  onClick={() => setModalTab("currency")}
                  className={`pb-2 relative ${
                    modalTab === "currency"
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  통화
                </button>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
                aria-label="닫기"
              >
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {modalTab === "lang" ? (
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">모든 언어</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {languages.map((lang) => {
                      const isSelected = selectedLang.code === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => handleLangSelect(lang)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-left text-xs font-bold transition-all ${
                            isSelected
                              ? "bg-gray-100 text-[#ae2f34] ring-1 ring-gray-200"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <span className="text-base shrink-0">{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Popular Currencies */}
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">주요 통화</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {currencies
                        .filter((c) => c.isPopular)
                        .map((cur) => {
                          const isSelected = selectedCurrency.code === cur.code;
                          return (
                            <button
                              key={cur.code}
                              onClick={() => handleCurrencySelect(cur)}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-left text-xs font-bold transition-all ${
                                isSelected
                                  ? "bg-gray-100 text-[#ae2f34] ring-1 ring-gray-200"
                                  : "hover:bg-gray-50 text-gray-700"
                              }`}
                            >
                              <span className="text-blue-600 font-extrabold">{cur.code}</span>
                              <span className="text-gray-400 font-medium">-</span>
                              <span>{cur.name} ({cur.symbol})</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* All Currencies */}
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">모든 통화</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {currencies.map((cur) => {
                        const isSelected = selectedCurrency.code === cur.code;
                        return (
                          <button
                            key={cur.code}
                            onClick={() => handleCurrencySelect(cur)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-left text-xs font-bold transition-all ${
                              isSelected
                                ? "bg-gray-100 text-[#ae2f34] ring-1 ring-gray-200"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            <span className="text-blue-600 font-extrabold shrink-0">{cur.code}</span>
                            <span className="text-gray-400 font-medium shrink-0">-</span>
                            <span className="truncate">{cur.name} ({cur.symbol})</span>
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
      )}
    </>
  );
}
