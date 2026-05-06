"use client";

import { AdminLogoutButton } from "./admin-logout-button";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  title?: string;
  username?: string;
  onMenuClick?: () => void;
}

export function AdminHeader({ title = "대시보드", username, onMenuClick }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b bg-card px-4 md:px-6 flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-2 md:gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 shrink-0 md:hidden"
          onClick={onMenuClick}
          aria-label="관리자 메뉴 열기"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="truncate text-base font-bold tracking-tight sm:text-lg">{title}</h2>
      </div>

      <div className="flex shrink-0 items-center gap-3 md:gap-4">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-xs font-bold text-foreground">{username}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Administrator</span>
        </div>
        <AdminLogoutButton />
      </div>
    </header>
  );
}
