"use client";

import { usePathname } from "next/navigation";
import { usePersonaThemeStore } from "@/store/persona-theme-store";
import { PersonaThemeId } from "@/lib/persona-theme";
import { useIsClient } from "@/hooks/use-is-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCompass,
  faBed,
  faRoute,
} from "@/lib/fontawesome";
import { cn } from "@/lib/utils";

export function PersonaOnboardingDialog() {
  const pathname = usePathname();
  const hasCompletedOnboarding = usePersonaThemeStore((state) => state.hasCompletedOnboarding);
  const completeOnboarding = usePersonaThemeStore((state) => state.completeOnboarding);
  const setTheme = usePersonaThemeStore((state) => state.setTheme);
  const isClient = useIsClient();
  const isAdmin = pathname.startsWith("/admin");
  const isOpen = isClient && !isAdmin && !hasCompletedOnboarding;

  if (!isClient) return null;

  const options = [
    {
      id: "masil" as PersonaThemeId,
      emoji: "👨‍👩‍👧‍👦",
      icon: faUsers,
      label: "아이들과 바닷가 마을에서 신나게 뛰어놀고 싶어요",
      desc: "체험, 가족, 로컬 먹거리를 쉽게 둘러보는 모드",
      color: "text-orange-600 bg-orange-50 border-orange-100 hover:border-orange-200 hover:bg-orange-100/50",
      iconBg: "bg-orange-100 text-orange-600",
    },
    {
      id: "haengrang" as PersonaThemeId,
      emoji: "🍵",
      icon: faBed,
      label: "조용히 파도 소리를 들으며 정갈하게 쉬고 싶어요",
      desc: "전통, 환대, 프리미엄 숙소 중심 모드",
      color: "text-amber-800 bg-amber-50 border-amber-100 hover:border-amber-200 hover:bg-amber-100/50",
      iconBg: "bg-amber-100 text-amber-800",
    },
    {
      id: "meomulm" as PersonaThemeId,
      emoji: "💻",
      icon: faCompass,
      label: "바다를 보며 영감을 얻는 나만의 시간이 필요해요",
      desc: "감성, 워케이션, 조용한 여정 중심 모드",
      color: "text-slate-700 bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-slate-100/50",
      iconBg: "bg-slate-200 text-slate-700",
    },
    {
      id: "local" as PersonaThemeId,
      emoji: "🚜",
      icon: faRoute,
      label: "동네 사람처럼 구수하게 둘러보고 싶어요",
      desc: "충청도 바이브가 적용되는 스페셜 모드",
      color: "text-emerald-700 bg-emerald-50 border-emerald-100 hover:border-emerald-200 hover:bg-emerald-100/50",
      iconBg: "bg-emerald-100 text-emerald-700",
    },
  ];

  const handleSelect = (themeId: PersonaThemeId) => {
    setTheme(themeId);
    completeOnboarding();
  };

  const handleLater = () => {
    completeOnboarding();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          completeOnboarding();
        }
      }}
    >
      <DialogContent className="max-w-md sm:max-w-[480px] p-6 rounded-3xl shadow-2xl animate-in fade-in-0 zoom-in-95 outline-none gap-5" showCloseButton={false}>
        <DialogHeader className="text-center space-y-2 select-none">
          <div className="mx-auto bg-gradient-to-br from-[#ae2f34] to-red-400 w-12 h-12 rounded-2xl flex items-center justify-center shadow-md mb-1">
            <span className="text-2xl text-white">✨</span>
          </div>
          <DialogTitle className="text-xl font-black tracking-tight text-gray-900 font-persona-display">
            이번 태안 여행,<br />어떤 시간을 기대하시나요?
          </DialogTitle>
          <DialogDescription className="text-gray-500 font-medium text-sm">
            선택에 따라 맞춤 테마와 카피 문구로 꾸며드릴게요.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 my-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={cn(
                "group w-full flex items-start gap-4 p-4 border rounded-2xl text-left transition-all active:scale-[0.98]",
                opt.color
              )}
            >
              <div className={cn("w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center font-semibold shadow-sm group-hover:scale-105 transition-transform", opt.iconBg)}>
                <FontAwesomeIcon icon={opt.icon} className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h4 className="text-[15px] font-extrabold leading-tight tracking-tight mb-1 break-keep">
                  {opt.label}
                </h4>
                <p className="text-[11px] opacity-75 font-medium break-all">
                  {opt.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-center pt-1">
          <button
            onClick={handleLater}
            className="text-xs font-bold text-gray-400 hover:text-gray-600 underline underline-offset-4 py-2 px-4 rounded-lg transition-colors"
          >
            나중에 선택할게요 (기본 테마 유지)
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
