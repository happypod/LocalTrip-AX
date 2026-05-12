import { AdminShell } from "@/components/admin/admin-shell";
import { 
  getDashboardStats, 
  getLeadEventSummary, 
  getPopularContent, 
  getRecentInquiries, 
  getRecentPartnerApplications 
} from "@/lib/admin-dashboard";
import { StatCard } from "@/components/admin/dashboard/stat-card";
import { RecentList } from "@/components/admin/dashboard/recent-list";
import { PopularContentList } from "@/components/admin/dashboard/popular-content-list";
import { LeadEventSummary } from "@/components/admin/dashboard/lead-event-summary";
import { AdminQuickActions } from "@/components/admin/dashboard/admin-quick-actions";
import { Bed, Compass, Store, Map, Users, UserPlus } from "lucide-react";

import { requireAdminSession } from "@/lib/admin-auth";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  await requireAdminSession();
  
  const [
    stats,
    leadSummary,
    popularContent,
    recentInquiries,
    recentPartners
  ] = await Promise.all([
    getDashboardStats(),
    getLeadEventSummary(),
    getPopularContent(),
    getRecentInquiries(),
    getRecentPartnerApplications()
  ]);

  return (
    <AdminShell title="관리자 대시보드">
      <div className="flex flex-col gap-6 py-6 max-w-7xl mx-auto">
        
        {/* Welcome Section */}
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-2xl font-bold tracking-tight">소원로컬트립 운영 현황</h1>
          <p className="text-muted-foreground text-sm">
            오늘의 실시간 통계 및 사용자 상호작용 지표를 확인하세요.
          </p>
        </div>

        {/* Top Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard title="운영 중인 숙소" value={stats.accommodations} icon={Bed} />
          <StatCard title="운영 중인 체험" value={stats.experiences} icon={Compass} />
          <StatCard title="운영 중인 주민상품" value={stats.programs} icon={Store} />
          <StatCard title="운영 중인 코스" value={stats.courses} icon={Map} />
          <StatCard title="전체 문의 수" value={stats.inquiries} icon={Users} />
          <StatCard title="입점 신청 수" value={stats.partnerApplications} icon={UserPlus} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
          
          {/* Left Column: Events & Popular Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <LeadEventSummary summary={leadSummary} />
            <PopularContentList items={popularContent} />
          </div>

          {/* Right Column: Recent Lists & Quick Actions */}
          <div className="flex flex-col gap-6">
            <AdminQuickActions />
            <RecentList title="최근 접수된 문의" items={recentInquiries} type="inquiry" />
            <RecentList title="최근 입점 신청" items={recentPartners} type="partner" />
          </div>

        </div>
      </div>
    </AdminShell>
  );
}
