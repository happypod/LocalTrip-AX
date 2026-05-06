"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  Store, 
  Home, 
  Compass, 
  Users, 
  Route, 
  MessageSquare, 
  UserPlus, 
  GraduationCap, 
  BarChart3, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Megaphone,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminMenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface AdminMenuGroup {
  group: string;
  items: AdminMenuItem[];
}

export const ADMIN_MENU_GROUPS: AdminMenuGroup[] = [
  { group: "현황", items: [
    { name: "대시보드", href: "/admin", icon: LayoutDashboard },
  ]},
  { group: "콘텐츠 관리", items: [
    { name: "지역 관리", href: "/admin/regions", icon: Map },
    { name: "사업자 관리", href: "/admin/businesses", icon: Store },
    { name: "숙소 관리", href: "/admin/stays", icon: Home },
    { name: "체험 관리", href: "/admin/experiences", icon: Compass },
    { name: "주민소득상품 관리", href: "/admin/programs", icon: Users },
    { name: "추천 코스 관리", href: "/admin/courses", icon: Route },
    { name: "이벤트 관리", href: "/admin/events", icon: Megaphone },
  ]},
  { group: "문의 및 접수", items: [
    { name: "문의 관리", href: "/admin/inquiries", icon: MessageSquare },
    { name: "입점신청 관리", href: "/admin/partner-applications", icon: UserPlus },
  ]},
  { group: "기타", items: [
    { name: "교육·인증", href: "/admin/training", icon: GraduationCap },
    { name: "AX 도우미", href: "/admin/ai-assistant", icon: Sparkles },
    { name: "성과 요약", href: "/admin/reports", icon: BarChart3 },
  ]},
];

interface AdminNavItemsProps {
  compact?: boolean;
  onNavigate?: () => void;
}

export function AdminNavItems({ compact = false, onNavigate }: AdminNavItemsProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col", compact ? "gap-6" : "gap-8")}>
      {ADMIN_MENU_GROUPS.map((group) => (
        <div key={group.group} className="flex flex-col gap-2">
          <h4 className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {group.group}
          </h4>
          <nav className="flex flex-col gap-1">
            {group.items.map((item) => {
              const isActive = item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all",
                    compact ? "py-3" : "py-2",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <span className="flex-1 truncate">{item.name}</span>
                  {isActive && <ChevronRight className="h-3 w-3 shrink-0" />}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}

export function AdminPublicSiteLink({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      target="_blank"
      onClick={onNavigate}
      className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
    >
      <ExternalLink className="h-4 w-4 shrink-0" />
      공개 사이트 보기
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
      isCollapsed ? "w-0 overflow-hidden border-r-0 opacity-0" : "w-64 opacity-100"
    )}>
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="text-xs">AX</span>
          </div>
          소원로컬트립
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
        <AdminNavItems />
      </div>

      <div className="p-4 border-t">
        <AdminPublicSiteLink />
      </div>
    </aside>
  );
}
