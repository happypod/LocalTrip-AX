import { MapItem, MapRegionUI } from "@/lib/map-types";

interface MapRegionSummaryProps {
  region: MapRegionUI | null;
  items: MapItem[];
}

export function MapRegionSummary({ region, items }: MapRegionSummaryProps) {
  // If no region is selected, we can show total summary or nothing. 
  // Let's show total summary when null.
  const title = region ? region.name : "소원권역 전체";
  
  const stayCount = items.filter(i => i.itemType === "stay").length;
  const expCount = items.filter(i => i.itemType === "experience").length;
  const progCount = items.filter(i => i.itemType === "program").length;
  const courseCount = items.filter(i => i.itemType === "course").length;

  return (
    <div className="bg-muted/30 border border-muted rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-lg text-foreground">{title} 요약</h3>
        <p className="text-sm text-muted-foreground">
          {region ? region.summary : "소원면에서 즐길 수 있는 다양한 로컬 콘텐츠"}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 sm:gap-6">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black text-category-stay">{stayCount}</span>
          <span className="text-xs font-medium text-muted-foreground">숙소</span>
        </div>
        <div className="w-px h-10 bg-border hidden sm:block" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black text-category-experience">{expCount}</span>
          <span className="text-xs font-medium text-muted-foreground">체험</span>
        </div>
        <div className="w-px h-10 bg-border hidden sm:block" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black text-category-program">{progCount}</span>
          <span className="text-xs font-medium text-muted-foreground">프로그램</span>
        </div>
        <div className="w-px h-10 bg-border hidden sm:block" />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black text-category-course">{courseCount}</span>
          <span className="text-xs font-medium text-muted-foreground">추천 코스</span>
        </div>
      </div>
    </div>
  );
}
