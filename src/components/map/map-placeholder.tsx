"use client";

import { MapRegionUI } from "@/lib/map-data";
import { Map, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapPlaceholderProps {
  regions: MapRegionUI[];
  selectedRegionId: string | null;
  onRegionSelect: (id: string | null) => void;
}

export function MapPlaceholder({ regions, selectedRegionId, onRegionSelect }: MapPlaceholderProps) {
  return (
    <div className="w-full bg-muted/40 border rounded-xl overflow-hidden shadow-sm flex flex-col relative h-[300px] sm:h-[400px]">
      
      {/* Background decoration to simulate a map */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: "radial-gradient(circle at 2px 2px, black 1px, transparent 0)", 
             backgroundSize: "20px 20px" 
           }} 
      />
      
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
        <Map className="w-64 h-64" />
      </div>

      <div className="p-4 z-10 bg-background/80 backdrop-blur-sm border-b flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Map className="w-4 h-4 text-primary" />
          권역별 탐색
        </div>
        <div className="text-xs text-muted-foreground hidden sm:block">
          정확한 지도 연동 전, 소원권역의 주요 거점별 콘텐츠를 먼저 제공합니다.
        </div>
      </div>

      {/* Mock Map Area with Interactive Pins */}
      <div className="flex-1 relative z-10 p-4 flex flex-wrap content-center justify-center gap-4 sm:gap-8">
        <button
          onClick={() => onRegionSelect(null)}
          className={cn(
            "absolute top-4 right-4 px-3 py-1.5 text-xs font-bold rounded-full transition-all border shadow-sm",
            selectedRegionId === null 
              ? "bg-primary text-primary-foreground border-primary" 
              : "bg-background text-foreground hover:bg-muted"
          )}
        >
          전체 보기
        </button>

        {regions.map((region) => {
          const isSelected = selectedRegionId === region.id;
          return (
            <button
              key={region.id}
              onClick={() => onRegionSelect(isSelected ? null : region.id)}
              className={cn(
                "group flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                isSelected 
                  ? "bg-background shadow-md border border-primary/30 scale-105" 
                  : "bg-background/60 border border-transparent hover:bg-background hover:shadow-sm"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm",
                isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-primary"
              )}>
                <MapPin className={cn("w-5 h-5", isSelected && "animate-bounce")} />
              </div>
              <div className="text-center">
                <div className={cn("text-sm font-bold", isSelected ? "text-primary" : "text-foreground")}>
                  {region.name}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {region.summary}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-3 text-center text-[11px] text-muted-foreground/60 bg-muted/20 border-t sm:hidden">
        정확한 지도 연동 전, 소원권역의 주요 거점별 콘텐츠를 먼저 제공합니다.
      </div>
    </div>
  );
}
