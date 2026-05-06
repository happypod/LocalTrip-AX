"use client";

import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface AIPlaceholderCardProps {
  title: string;
  targets: string;
  exampleTitle: string;
  exampleContent: ReactNode;
  icon: ReactNode;
}

export function AIPlaceholderCard({ 
  title, 
  targets, 
  exampleTitle, 
  exampleContent, 
  icon 
}: AIPlaceholderCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
      
      {/* Sparkle background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full -mr-8 -mt-8 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/5 rounded-xl text-primary shrink-0 group-hover:bg-primary/10 transition-colors">
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-base md:text-lg">{title}</h3>
              <p className="text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-full w-fit mt-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Post-MVP 확장 기능
              </p>
            </div>
          </div>
        </div>

        {/* Targets */}
        <div className="flex flex-col gap-1 mt-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">적용 지원 대상</span>
          <p className="text-sm text-gray-700 font-medium">{targets}</p>
        </div>

        {/* Example Block */}
        <div className="bg-gray-50/70 border border-gray-100/80 rounded-xl p-4 flex flex-col gap-2 mt-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AI 출력 예시 ({exampleTitle})</span>
          <div className="text-sm text-gray-600 space-y-1.5 leading-relaxed font-normal">
            {exampleContent}
          </div>
        </div>
      </div>

      {/* Footer disabled button */}
      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
        <span className="text-xs text-gray-400 font-medium">실제 AI API 연동 예정</span>
        <button
          disabled
          className="text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl cursor-not-allowed transition-all select-none"
        >
          Post-MVP에서 활성화
        </button>
      </div>

    </div>
  );
}
