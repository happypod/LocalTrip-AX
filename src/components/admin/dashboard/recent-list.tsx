import { maskName, maskPhone } from "@/lib/privacy";

interface RecentItem {
  id: string;
  name?: string;
  applicantName?: string;
  businessName?: string;
  phone?: string | null;
  message?: string | null;
  createdAt: Date;
  status: string;
}

interface RecentListProps {
  title: string;
  items: RecentItem[];
  type: "inquiry" | "partner";
}

export function RecentList({ title, items, type }: RecentListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {items.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            최근 내역이 없습니다.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium text-gray-900">
                    {type === "partner" ? item.businessName : maskName(item.name || null)}
                  </span>
                  {type === "partner" && item.applicantName && (
                    <span className="text-gray-500 text-sm ml-2">
                      ({maskName(item.applicantName)})
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                연락처: {maskPhone(item.phone || null)}
              </div>
              {item.message && (
                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.message}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
