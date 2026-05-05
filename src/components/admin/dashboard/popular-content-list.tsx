interface PopularContentItem {
  targetType: string | null;
  targetId: string | null;
  title: string;
  count: number;
}

interface PopularContentListProps {
  items: PopularContentItem[];
}

export function PopularContentList({ items }: PopularContentListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">인기 콘텐츠 (클릭 수 Top 5)</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {items.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            데이터가 없습니다.
          </div>
        ) : (
          items.map((item, index) => (
            <div key={`${item.targetType}-${item.targetId}`} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-1 capitalize">{item.targetType}</div>
                </div>
              </div>
              <div className="font-semibold text-primary">{item.count}회</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
