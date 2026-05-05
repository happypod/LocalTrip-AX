"use client";

import { useState, useMemo } from "react";
import { MapItem, MapItemType, MAP_REGIONS } from "@/lib/map-data";
import { MapPlaceholder } from "./map-placeholder";
import { MapFilterTabs } from "./map-filter-tabs";
import { MapRegionSummary } from "./map-region-summary";
import { MapItemCard } from "./map-item-card";

interface MapShellProps {
  initialItems: MapItem[];
}

export function MapShell({ initialItems }: MapShellProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<MapItemType | "all">("all");

  const selectedRegion = useMemo(() => 
    selectedRegionId ? MAP_REGIONS.find(r => r.id === selectedRegionId) || null : null
  , [selectedRegionId]);

  // Filter items
  const filteredItems = useMemo(() => {
    return initialItems.filter(item => {
      // Filter by type
      if (selectedType !== "all" && item.itemType !== selectedType) return false;
      
      // Filter by region (if region is selected)
      if (selectedRegionId) {
        // We use string includes here because fallback regionName might just contain the string
        // In a real app, it would be an exact ID match
        const regionNameSearch = selectedRegion?.name.replace(" 권역", "") || "";
        if (!item.regionName.includes(regionNameSearch)) return false;
      }
      
      return true;
    });
  }, [initialItems, selectedType, selectedRegionId, selectedRegion]);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      
      {/* 1. Interactive Map Area */}
      <MapPlaceholder 
        regions={MAP_REGIONS}
        selectedRegionId={selectedRegionId}
        onRegionSelect={setSelectedRegionId}
      />

      {/* 2. Filter Tabs */}
      <div className="sticky top-14 z-20 bg-background/95 backdrop-blur py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <MapFilterTabs 
          selectedType={selectedType}
          onTypeSelect={setSelectedType}
        />
      </div>

      {/* 3. Region Summary */}
      <MapRegionSummary 
        region={selectedRegion}
        items={filteredItems}
      />

      {/* 4. List Area */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-xl font-bold">
            {selectedRegion ? `${selectedRegion.name} 콘텐츠` : "전체 콘텐츠"}
            <span className="ml-2 text-muted-foreground text-sm font-normal">
              총 {filteredItems.length}개
            </span>
          </h3>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <MapItemCard key={`${item.itemType}-${item.id}`} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-muted/20 border border-dashed rounded-xl flex flex-col items-center justify-center p-12 text-center">
            <p className="text-muted-foreground">해당 권역에 일치하는 콘텐츠가 없습니다.</p>
            <button 
              onClick={() => { setSelectedType("all"); setSelectedRegionId(null); }}
              className="mt-4 text-sm font-medium text-primary hover:underline"
            >
              모든 콘텐츠 보기
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
}
