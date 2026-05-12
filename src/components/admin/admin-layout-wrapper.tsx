"use client";

import { useState } from "react";
import { AdminNavItems, AdminPublicSiteLink, AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  title?: string;
  username?: string;
}

export function AdminLayoutWrapper({ children, title, username }: AdminLayoutWrapperProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/20 relative">
      {/* Collapsible Sidebar */}
      <AdminSidebar isCollapsed={isCollapsed} />

      {/* Flying Collapsible Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "fixed top-20 z-50 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white shadow-md border border-primary/20 hover:scale-110 hover:bg-primary/90 active:scale-95 transition-all duration-300 cursor-pointer hidden md:flex",
          isCollapsed ? "left-[64px]" : "left-[240px]"
        )}
        title={isCollapsed ? "사이드바 열기" : "사이드바 접기"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 animate-pulse" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300">
        <AdminHeader
          title={title}
          username={username}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-10">
          <div className="max-w-screen-xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[80] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="관리자 메뉴 닫기"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(320px,calc(100vw-48px))] flex-col bg-card shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2 font-bold tracking-tight">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs text-white">
                  AX
                </div>
                소원로컬트립
              </div>
              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="관리자 메뉴 닫기"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <AdminNavItems compact onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>
            <div className="border-t p-4">
              <AdminPublicSiteLink onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
