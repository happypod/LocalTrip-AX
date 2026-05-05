import { AdminLogoutButton } from "./admin-logout-button";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  title?: string;
  username?: string;
}

export function AdminHeader({ title = "대시보드", username }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-xs font-bold text-foreground">{username}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Administrator</span>
        </div>
        <AdminLogoutButton />
      </div>
    </header>
  );
}
