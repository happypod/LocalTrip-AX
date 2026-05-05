import { LeadEventType } from "@prisma/client";
import { MousePointerClick, Phone, MessageCircle, CalendarCheck, Globe, UserPlus } from "lucide-react";

interface LeadEventSummaryProps {
  summary: Partial<Record<LeadEventType, number>>;
}

const EVENT_CONFIG: Record<LeadEventType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  phone_click: { label: "전화 문의 클릭", icon: Phone, color: "text-blue-600", bg: "bg-blue-50" },
  kakao_click: { label: "카카오톡 문의", icon: MessageCircle, color: "text-yellow-600", bg: "bg-yellow-50" },
  naver_booking_click: { label: "네이버 예약", icon: CalendarCheck, color: "text-green-600", bg: "bg-green-50" },
  website_click: { label: "홈페이지 방문", icon: Globe, color: "text-purple-600", bg: "bg-purple-50" },
  inquiry_submit: { label: "온라인 문의 접수", icon: MousePointerClick, color: "text-rose-600", bg: "bg-rose-50" },
  partner_apply_submit: { label: "입점 신청 접수", icon: UserPlus, color: "text-indigo-600", bg: "bg-indigo-50" },
};

export function LeadEventSummary({ summary }: LeadEventSummaryProps) {
  const events = Object.entries(EVENT_CONFIG) as [LeadEventType, typeof EVENT_CONFIG[LeadEventType]][];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">사용자 상호작용 (Lead Events)</h3>
      </div>
      <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {events.map(([type, config]) => {
          const count = summary[type] || 0;
          const Icon = config.icon;
          
          return (
            <div key={type} className="flex flex-col p-4 rounded-xl border border-gray-50 bg-gray-50/50">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${config.bg}`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-600">{config.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
