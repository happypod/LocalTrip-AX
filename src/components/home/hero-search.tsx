"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faHouseChimney,
  faMagnifyingGlass,
  faPersonHiking,
  faRoute,
  faStore,
  faUserGroup,
} from "@/lib/fontawesome";

import { usePersonaThemeStore } from "@/store/persona-theme-store";
import { getStaticLabels } from "@/lib/static-translations";

export function HeroSearch() {
  const [activeTab, setActiveTab] = useState<"stay" | "experience" | "program" | "course">("stay");
  const currentLang = usePersonaThemeStore((state) => state.currentLang);
  const labels = getStaticLabels(currentLang);

  const tabs = [
    { id: "stay", label: labels.tabStay, icon: faHouseChimney },
    { id: "experience", label: labels.tabExperience, icon: faPersonHiking },
    { id: "program", label: labels.tabProgram, icon: faStore },
    { id: "course", label: labels.tabCourse, icon: faRoute },
  ] as const;

  return (
    <div className="relative mt-12 w-full max-w-5xl mx-auto">
      {/* Deep Teal Pill Floating Tabs with glassmorphism */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center bg-[#057771]/95 backdrop-blur-md p-1.5 rounded-full shadow-[0_12px_40px_rgba(5,119,113,0.25)] z-20 gap-1 sm:gap-1.5 border border-white/20 max-w-[95%] sm:max-w-max overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-black rounded-full transition-all duration-300 shrink-0 ${
                isActive
                  ? "bg-white text-[#057771] shadow-md transform scale-105"
                  : "text-teal-50/85 hover:text-white hover:bg-white/10"
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className={`h-3.5 w-3.5 ${isActive ? "text-[#057771]" : "text-teal-100/70"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Search Form Card */}
      <form
        action="/map"
        className="w-full rounded-3xl border border-white/60 bg-white/95 p-6 pt-10 shadow-[0_20px_70px_-30px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-0"
      >
        <input type="hidden" name="type" value={activeTab} />

        {/* Section 1: Keyword */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2 md:py-0 text-left">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4 text-[#161d1f]/60 shrink-0" />
          <div className="flex flex-col items-start w-full">
            <span className="hidden md:inline text-[9px] font-black text-gray-500 uppercase tracking-wider">
              {activeTab === "stay"
                ? labels.searchStayLabel
                : activeTab === "experience"
                ? labels.searchExpLabel
                : activeTab === "program"
                ? labels.searchProgLabel
                : labels.searchCourseLabel}
            </span>
            <input
              name="q"
              aria-label={labels.searchBtn}
              placeholder={
                activeTab === "stay"
                  ? labels.searchStayPlaceholder
                  : activeTab === "experience"
                  ? labels.searchExpPlaceholder
                  : activeTab === "program"
                  ? labels.searchProgPlaceholder
                  : labels.searchCoursePlaceholder
              }
              className="w-full bg-transparent text-sm font-semibold text-[#161d1f] outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Vertical Divider 1 */}
        <div className="hidden md:block w-px h-10 bg-gray-200 shrink-0" />

        {/* Section 2: Date */}
        <div className="flex-1 md:flex-initial md:w-[250px] flex items-center gap-3 px-4 py-2 md:py-0 text-left border-t border-b border-gray-100 md:border-none">
          <FontAwesomeIcon icon={faCalendarDays} className="h-4 w-4 text-[#161d1f]/60 shrink-0" />
          <div className="flex flex-col items-start w-full">
            <span className="hidden md:inline text-[9px] font-black text-gray-500 uppercase tracking-wider">{labels.dateLabel}</span>
            <input
              name="date"
              type="text"
              placeholder={labels.datePlaceholder}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!e.target.value) {
                  e.target.type = "text";
                }
              }}
              aria-label={labels.dateLabel}
              className="w-full bg-transparent text-sm font-semibold text-[#161d1f] outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Vertical Divider 2 */}
        <div className="hidden md:block w-px h-10 bg-gray-200 shrink-0" />

        {/* Section 3: Guests */}
        <div className="flex-1 md:flex-initial md:w-[180px] flex items-center gap-3 px-4 py-2 md:py-0 text-left">
          <FontAwesomeIcon icon={faUserGroup} className="h-4 w-4 text-[#161d1f]/60 shrink-0" />
          <div className="flex flex-col items-start w-full">
            <span className="hidden md:inline text-[9px] font-black text-gray-500 uppercase tracking-wider">{labels.guestsLabel}</span>
            <input
              name="guests"
              type="number"
              min="1"
              placeholder={labels.guestsPlaceholder}
              aria-label={labels.guestsLabel}
              className="w-full bg-transparent text-sm font-semibold text-[#161d1f] outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="rounded-2xl md:rounded-full bg-[#161d1f] px-8 py-3.5 md:py-3.5 text-sm font-black text-white shadow-md hover:bg-[#ae2f34] transition-all shrink-0 flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className="h-3.5 w-3.5" />
          <span>{labels.searchBtn}</span>
        </button>
      </form>
    </div>
  );
}
