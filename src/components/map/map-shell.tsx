"use client";

import { useState, useMemo } from "react";
import { MapItem, MapItemType, MAP_REGIONS } from "@/lib/map-data";
import { MapPlaceholder } from "./map-placeholder";
import { MapFilterTabs } from "./map-filter-tabs";
import { MapRegionSummary } from "./map-region-summary";
import { MapItemCard } from "./map-item-card";

import { Search, Calendar, Users, X } from "lucide-react";

interface MapShellProps {
  initialItems: MapItem[];
  initialQuery?: string;
  initialDate?: string;
  initialGuests?: string;
  initialType?: string;
}

export function MapShell({ 
  initialItems, 
  initialQuery, 
  initialDate, 
  initialGuests,
  initialType
}: MapShellProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<MapItemType | "all">((initialType as MapItemType) || "all");
  const [query, setQuery] = useState(initialQuery || "");
  const [date, setDate] = useState(initialDate || "");
  const [guests, setGuests] = useState(initialGuests || "");

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
        const regionNameSearch = selectedRegion?.name.replace(" 권역", "") || "";
        if (!item.regionName.includes(regionNameSearch)) return false;
      }

      // Filter by query (case-insensitive title or summary search)
      if (query) {
        const qLower = query.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(qLower);
        const matchesSummary = item.summary ? item.summary.toLowerCase().includes(qLower) : false;
        if (!matchesTitle && !matchesSummary) return false;
      }
      
      return true;
    });
  }, [initialItems, selectedType, selectedRegionId, selectedRegion, query]);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      
      {/* 1. Interactive Map Area */}
      <MapPlaceholder 
        regions={MAP_REGIONS}
        selectedRegionId={selectedRegionId}
        onRegionSelect={setSelectedRegionId}
      />

      {/* Active Search Conditions Badges */}
      {(query || date || guests) && (
        <div className="flex flex-wrap gap-2.5 bg-gray-50 border border-gray-100 rounded-2xl p-4 items-center shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">활성 검색 조건:</span>
          {query && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-xs text-gray-700 font-bold px-3 py-1.5 rounded-xl shadow-sm">
              <Search className="w-3.5 h-3.5 text-primary" />
              <span>키워드: &ldquo;{query}&rdquo;</span>
              <button onClick={() => setQuery("")} className="hover:text-red-500 transition-colors p-0.5 ml-1" aria-label="키워드 필터 제거">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {date && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-xs text-gray-700 font-bold px-3 py-1.5 rounded-xl shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>일정: {date}</span>
              <button onClick={() => setDate("")} className="hover:text-red-500 transition-colors p-0.5 ml-1" aria-label="일정 필터 제거">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {guests && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-xs text-gray-700 font-bold px-3 py-1.5 rounded-xl shadow-sm">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>인원수: {guests}명</span>
              <button onClick={() => setGuests("")} className="hover:text-red-500 transition-colors p-0.5 ml-1" aria-label="인원수 필터 제거">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button 
            onClick={() => { setQuery(""); setDate(""); setGuests(""); }} 
            className="text-xs text-primary font-bold hover:underline ml-auto"
          >
            모든 필터 초기화
          </button>
        </div>
      )}

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
