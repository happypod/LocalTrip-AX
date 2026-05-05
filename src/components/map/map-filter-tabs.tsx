import { MapItemType } from "@/lib/map-data";
import { cn } from "@/lib/utils";

interface MapFilterTabsProps {
  selectedType: MapItemType | "all";
  onTypeSelect: (type: MapItemType | "all") => void;
}

export function MapFilterTabs({ selectedType, onTypeSelect }: MapFilterTabsProps) {
  const tabs: { id: MapItemType | "all"; label: string; colorClass?: string }[] = [
    { id: "all", label: "전체보기" },
    { id: "stay", label: "숙소", colorClass: "text-category-stay bg-category-stay/10 border-category-stay/20" },
    { id: "experience", label: "체험", colorClass: "text-category-experience bg-category-experience/10 border-category-experience/20" },
    { id: "program", label: "주민 프로그램", colorClass: "text-category-program bg-category-program/10 border-category-program/20" },
    { id: "course", label: "추천 코스", colorClass: "text-category-course bg-category-course/10 border-category-course/20" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isSelected = selectedType === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTypeSelect(tab.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold transition-all border",
              isSelected 
                ? tab.id === "all" 
                  ? "bg-foreground text-background border-foreground"
                  : cn(tab.colorClass, "border-transparent shadow-sm")
                : "bg-card text-muted-foreground border-border hover:bg-muted"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
