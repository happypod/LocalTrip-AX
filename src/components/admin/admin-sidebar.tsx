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
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { group: "현황", items: [
    { name: "대시보드", href: "/admin", icon: LayoutDashboard },
  ]},
  { group: "콘텐츠 관리", items: [
    { name: "지역 관리", href: "/admin/regions", icon: Map },
    { name: "사업자 관리", href: "/admin/businesses", icon: Store },
    { name: "숙소 관리", href: "/admin/stays", icon: Home },
    { name: "체험 관리", href: "/admin/experiences", icon: Compass },
    { name: "주민 프로그램 관리", href: "/admin/programs", icon: Users },
    { name: "추천 코스 관리", href: "/admin/courses", icon: Route },
  ]},
  { group: "문의 및 접수", items: [
    { name: "문의 관리", href: "/admin/inquiries", icon: MessageSquare },
    { name: "입점신청 관리", href: "/admin/partner-applications", icon: UserPlus },
  ]},
  { group: "기타", items: [
    { name: "교육·인증", href: "/admin/training", icon: GraduationCap },
    { name: "성과 요약", href: "/admin/reports", icon: BarChart3 },
  ]},
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card shrink-0">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="text-xs">AX</span>
          </div>
          소원로컬트립
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
        {MENU_ITEMS.map((group) => (
          <div key={group.group} className="flex flex-col gap-2">
            <h4 className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {group.group}
            </h4>
            <nav className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = item.href === '/admin' 
                  ? pathname === '/admin' 
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    <span className="flex-1">{item.name}</span>
                    {isActive && <ChevronRight className="w-3 h-3" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          공개 사이트 보기
        </Link>
      </div>
    </aside>
  );
}
