"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faBed,
  faBullhorn,
  faChartLine,
  faChevronRight,
  faCompass,
  faGaugeHigh,
  faGraduationCap,
  faMap,
  faMessage,
  faRoute,
  faStore,
  faUserPlus,
  faUsers,
  faWandMagicSparkles,
} from "@/lib/fontawesome";
import { cn } from "@/lib/utils";

interface AdminMenuItem {
  name: string;
  href: string;
  icon: IconDefinition;
}

interface AdminMenuGroup {
  group: string;
  items: AdminMenuItem[];
}

export const ADMIN_MENU_GROUPS: AdminMenuGroup[] = [
  { group: "현황", items: [
    { name: "대시보드", href: "/admin", icon: faGaugeHigh },
  ]},
  { group: "콘텐츠 관리", items: [
    { name: "지역 관리", href: "/admin/regions", icon: faMap },
    { name: "사업자 관리", href: "/admin/businesses", icon: faStore },
    { name: "숙소 관리", href: "/admin/stays", icon: faBed },
    { name: "체험 관리", href: "/admin/experiences", icon: faCompass },
    { name: "주민소득상품 관리", href: "/admin/programs", icon: faUsers },
    { name: "추천 코스 관리", href: "/admin/courses", icon: faRoute },
    { name: "이벤트 관리", href: "/admin/events", icon: faBullhorn },
  ]},
  { group: "문의 및 접수", items: [
    { name: "문의 관리", href: "/admin/inquiries", icon: faMessage },
    { name: "입점신청 관리", href: "/admin/partner-applications", icon: faUserPlus },
  ]},
  { group: "기타", items: [
    { name: "교육·인증", href: "/admin/training", icon: faGraduationCap },
    { name: "AX 도우미", href: "/admin/ai-assistant", icon: faWandMagicSparkles },
    { name: "성과 요약", href: "/admin/reports", icon: faChartLine },
  ]},
];

interface AdminNavItemsProps {
  compact?: boolean;
  iconsOnly?: boolean;
  onNavigate?: () => void;
}

export function AdminNavItems({ compact = false, iconsOnly = false, onNavigate }: AdminNavItemsProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col", iconsOnly ? "items-center gap-5" : compact ? "gap-6" : "gap-8")}>
      {ADMIN_MENU_GROUPS.map((group) => (
        <div key={group.group} className={cn("flex flex-col gap-2", iconsOnly && "items-center")}>
          <h4 className={cn(
            "px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest",
            iconsOnly && "sr-only"
          )}>
            {group.group}
          </h4>
          <nav className={cn("flex flex-col gap-1", iconsOnly && "items-center")}>
            {group.items.map((item) => {
              const isActive = item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-label={item.name}
                  title={iconsOnly ? item.name : undefined}
                  className={cn(
                    "group flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all",
                    iconsOnly && "size-11 justify-center gap-0 px-0 py-0",
                    compact ? "py-3" : "py-2",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <FontAwesomeIcon icon={item.icon} className={cn(
                    iconsOnly ? "h-5 w-5" : "h-4 w-4",
                    "shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  {!iconsOnly && <span className="flex-1 truncate">{item.name}</span>}
                  {isActive && !iconsOnly && (
                    <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3 shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}

export function AdminPublicSiteLink({ onNavigate, iconsOnly = false }: { onNavigate?: () => void; iconsOnly?: boolean }) {
  return (
    <Link
      href="/"
      target="_blank"
      onClick={onNavigate}
      aria-label="공개 사이트 보기"
      title={iconsOnly ? "공개 사이트 보기" : undefined}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground",
        iconsOnly && "size-11 justify-center gap-0 px-0 py-0"
      )}
    >
      <FontAwesomeIcon icon={faArrowUpRightFromSquare} className={cn(iconsOnly ? "h-5 w-5" : "h-4 w-4", "shrink-0")} />
      {!iconsOnly && "공개 사이트 보기"}
    </Link>
  );
}

interface AdminSidebarProps {
  isCollapsed?: boolean;
}

export function AdminSidebar({ isCollapsed = false }: AdminSidebarProps) {
  return (
    <aside className={cn(
      "hidden md:flex flex-col border-r bg-card shrink-0 transition-all duration-300 ease-in-out h-screen sticky top-0",
      isCollapsed ? "w-20 opacity-100" : "w-64 opacity-100"
    )}>
      <div className={cn("h-16 flex items-center border-b", isCollapsed ? "justify-center px-0" : "px-6")}>
        <Link
          href="/admin"
          aria-label="관리자 대시보드"
          title={isCollapsed ? "소원로컬트립 관리자" : undefined}
          className={cn("flex items-center gap-2 font-bold text-lg tracking-tight", isCollapsed && "justify-center")}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="text-xs">AX</span>
          </div>
          {!isCollapsed && "소원로컬트립"}
        </Link>
      </div>

      <div className={cn("flex-1 overflow-y-auto py-6 flex flex-col gap-8", isCollapsed ? "px-0" : "px-4")}>
        <AdminNavItems iconsOnly={isCollapsed} />
      </div>

      <div className={cn("border-t", isCollapsed ? "flex justify-center p-3" : "p-4")}>
        <AdminPublicSiteLink iconsOnly={isCollapsed} />
      </div>
    </aside>
  );
}
