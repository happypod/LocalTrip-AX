import Link from "next/link";
import { Bed, Compass, Store, Map, Settings, Users } from "lucide-react";

const ACTIONS = [
  { title: "숙소 관리", href: "/admin/stays", icon: Bed, color: "text-blue-600", bg: "bg-blue-50" },
  { title: "체험 관리", href: "/admin/experiences", icon: Compass, color: "text-emerald-600", bg: "bg-emerald-50" },
  { title: "주민사업체 관리", href: "/admin/programs", icon: Store, color: "text-orange-600", bg: "bg-orange-50" },
  { title: "코스 관리", href: "/admin/courses", icon: Map, color: "text-indigo-600", bg: "bg-indigo-50" },
  { title: "문의 내역", href: "/admin/inquiries", icon: Users, color: "text-rose-600", bg: "bg-rose-50" },
  { title: "설정", href: "/admin/settings", icon: Settings, color: "text-gray-600", bg: "bg-gray-50" },
];

export function AdminQuickActions() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">빠른 실행 (메뉴)</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">T-016~T-021</span>
      </div>
      <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link 
              key={action.title} 
              href={action.href}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-primary hover:shadow-md transition-all group"
            >
              <div className={`p-3 rounded-xl mb-3 ${action.bg} group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                {action.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
