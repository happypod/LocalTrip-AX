import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { AdminLayoutWrapper } from "./admin-layout-wrapper";

interface AdminShellProps {
  children: React.ReactNode;
  title?: string;
}

export async function AdminShell({ children, title }: AdminShellProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminLayoutWrapper title={title} username={session}>
      {children}
    </AdminLayoutWrapper>
  );
}
