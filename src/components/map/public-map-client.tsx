"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Script from "next/script";
import { trackMapLeadEvent } from "@/lib/track-map-lead-event";
import { MapItem, MapItemType, MAP_REGIONS } from "@/lib/map-data";
import { MapPlaceholder } from "./map-placeholder";
import { MapFilterTabs } from "./map-filter-tabs";
import { MapRegionSummary } from "./map-region-summary";
import { MapItemCard } from "./map-item-card";

import { Search, Calendar, Users, X, MapPin } from "lucide-react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    naver: any;
  }
}

interface PublicMapClientProps {
  initialItems: MapItem[];
  initialQuery?: string;
  initialDate?: string;
  initialGuests?: string;
  initialType?: string;
}

export function PublicMapClient({ 
  initialItems, 
  initialQuery, 
  initialDate, 
  initialGuests,
  initialType
}: PublicMapClientProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<MapItemType | "all">((initialType as MapItemType) || "all");
  const [query, setQuery] = useState(initialQuery || "");
  const [date, setDate] = useState(initialDate || "");
  const [guests, setGuests] = useState(initialGuests || "");

  // 지도 상태
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapElement = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);

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

  const itemsWithCoords = useMemo(() => filteredItems.filter(i => i.latitude != null && i.longitude != null), [filteredItems]);
  const itemsWithoutCoords = useMemo(() => filteredItems.filter(i => i.latitude == null || i.longitude == null), [filteredItems]);

  const initMap = () => {
    if (!mapElement.current || !window.naver || !window.naver.maps) return;

    // 만리포 기준 초기 위치 (또는 선택된 지역)
    const centerLat = selectedRegion?.lat || 36.7865;
    const centerLng = selectedRegion?.lng || 126.1362;

    const mapOptions = {
      center: new window.naver.maps.LatLng(centerLat, centerLng),
      zoom: 13,
      minZoom: 10,
    };

    mapInstance.current = new window.naver.maps.Map(mapElement.current, mapOptions);
    renderMarkers();
  };

  const getMarkerIcon = (type: MapItemType) => {
    const colorMap: Record<string, string> = {
      stay: "#3b82f6", // blue-500
      experience: "#f59e0b", // amber-500
      program: "#10b981", // emerald-500
      course: "#8b5cf6", // violet-500
      business: "#3f3f46", // zinc-700
    };
    const color = colorMap[type] || "#6b7280";

    return {
      content: `
        <div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); cursor: pointer;"></div>
      `,
      size: new window.naver.maps.Size(24, 24),
      anchor: new window.naver.maps.Point(12, 12),
    };
  };

  const renderMarkers = () => {
    if (!mapInstance.current || !window.naver || !window.naver.maps) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.naver.maps.LatLngBounds();

    itemsWithCoords.forEach((item) => {
      const position = new window.naver.maps.LatLng(item.latitude!, item.longitude!);
      
      const marker = new window.naver.maps.Marker({
        position,
        map: mapInstance.current,
        title: item.title,
        icon: getMarkerIcon(item.itemType),
      });

      window.naver.maps.Event.addListener(marker, 'click', () => {
        // T-053: track map_marker_click here.
        trackMapLeadEvent({
          action: "marker_click",
          targetId: item.id,
          targetType: item.itemType,
          targetSlug: item.slug,
          targetTitle: item.title,
          regionId: item.regionId,
        });

        // open info window or scroll to card
        const cardElement = document.getElementById(`card-${item.id}`);
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    if (itemsWithCoords.length > 0 && mapInstance.current) {
      mapInstance.current.fitBounds(bounds, { margin: new window.naver.maps.Margin(50, 50, 50, 50) });
    }
  };

  // Re-render markers when filtered items change
  useEffect(() => {
    if (mapLoaded && mapInstance.current) {
      renderMarkers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsWithCoords, mapLoaded]);

  // Center map on selected region
  useEffect(() => {
    if (mapLoaded && mapInstance.current && selectedRegion) {
      const position = new window.naver.maps.LatLng(selectedRegion.lat, selectedRegion.lng);
      mapInstance.current.setCenter(position);
      mapInstance.current.setZoom(14);
    }
  }, [selectedRegion, mapLoaded]);


  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {clientId && (
        <Script 
          strategy="lazyOnload"
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`}
          onLoad={() => {
            setMapLoaded(true);
            initMap();
          }}
          onError={() => setMapError(true)}
        />
      )}

      {/* 1. Interactive Map Area */}
      {(!clientId || mapError) ? (
        <MapPlaceholder 
          regions={MAP_REGIONS}
          selectedRegionId={selectedRegionId}
          onRegionSelect={setSelectedRegionId}
        />
      ) : (
        <div className="relative w-full h-[60vh] sm:h-[640px] bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-200">
          <div ref={mapElement} className="w-full h-full" />
          
          {/* Map Type Filter Overlay */}
          <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur rounded-xl shadow-md p-2 flex flex-col gap-1">
            <button 
              onClick={() => setSelectedType("all")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${selectedType === "all" ? "bg-gray-900 text-white" : "hover:bg-gray-100"}`}
            >전체</button>
            <button 
              onClick={() => setSelectedType("stay")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${selectedType === "stay" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>숙소
            </button>
            <button 
              onClick={() => setSelectedType("experience")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${selectedType === "experience" ? "bg-amber-50 text-amber-700" : "hover:bg-gray-100"}`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>체험
            </button>
            <button 
              onClick={() => setSelectedType("program")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${selectedType === "program" ? "bg-emerald-50 text-emerald-700" : "hover:bg-gray-100"}`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>주민상품
            </button>
            <button 
              onClick={() => setSelectedType("course")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${selectedType === "course" ? "bg-violet-50 text-violet-700" : "hover:bg-gray-100"}`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>코스
            </button>
            <button 
              onClick={() => setSelectedType("business")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${selectedType === "business" ? "bg-zinc-100 text-zinc-800" : "hover:bg-gray-100"}`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>운영자
            </button>
          </div>
        </div>
      )}

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

      {/* 2. Filter Tabs (Only show if fallback placeholder is active, or we can keep it as is. Map also has it now. Let's keep the filter tabs.) */}
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
        {itemsWithCoords.length > 0 && (
          <>
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                지도 표시 콘텐츠
                <span className="ml-2 text-muted-foreground text-sm font-normal">
                  총 {itemsWithCoords.length}개
                </span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {itemsWithCoords.map(item => (
                <div id={`card-${item.id}`} key={`${item.itemType}-${item.id}`}>
                  <MapItemCard item={item} />
                </div>
              ))}
            </div>
          </>
        )}

        {itemsWithoutCoords.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-end mb-4 border-b pb-2">
              <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                위치 준비 중 콘텐츠
                <span className="ml-2 text-muted-foreground text-sm font-normal">
                  총 {itemsWithoutCoords.length}개
                </span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-80">
              {itemsWithoutCoords.map(item => (
                <div id={`card-${item.id}`} key={`${item.itemType}-${item.id}`}>
                  <MapItemCard item={item} />
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="bg-muted/20 border border-dashed rounded-xl flex flex-col items-center justify-center p-12 text-center mt-4">
            <p className="text-muted-foreground">해당 조건에 일치하는 콘텐츠가 없습니다.</p>
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
