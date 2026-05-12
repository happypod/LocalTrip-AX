"use client";

import { useState } from "react";
import Link from "next/link";
import { MapItem } from "@/lib/map-data";
import { Bed, Leaf, HeartHandshake, Compass, MapPin, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackLeadEvent, LeadItemType } from "@/lib/lead-event";

interface MapItemCardProps {
  item: MapItem;
}

export function MapItemCard({ item }: MapItemCardProps) {
  const [imgError, setImgError] = useState(false);

  const handleTrack = () => {
    // map the mapItem type to LeadItemType
    const itemTypeMap: Record<string, LeadItemType> = {
      stay: "accommodation",
      experience: "experience",
      program: "local_income_program",
      course: "course",
    };
    
    const mappedType = itemTypeMap[item.itemType] || "general";

    trackLeadEvent({
      itemType: mappedType,
      itemId: item.id,
      itemSlug: item.href.split("/").pop() || "",
      actionType: "map_click",
      targetUrl: item.href,
    });
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "stay": return "bg-category-stay text-white";
      case "experience": return "bg-category-experience text-white";
      case "program": return "bg-category-program text-white";
      case "course": return "bg-category-course text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "stay": return "숙소";
      case "experience": return "체험";
      case "program": return "주민소득상품";
      case "course": return "추천 코스";
      default: return "기타";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "stay": return <Bed className="w-3.5 h-3.5" />;
      case "experience": return <Leaf className="w-3.5 h-3.5" />;
      case "program": return <HeartHandshake className="w-3.5 h-3.5" />;
      case "course": return <Compass className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  return (
    <Link 
      href={item.href}
      onClick={handleTrack}
      className="group flex flex-col sm:flex-row bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full sm:h-32"
    >
      {/* Image Area */}
      <div className="w-full sm:w-32 h-32 sm:h-full relative shrink-0 bg-muted border-b sm:border-b-0 sm:border-r flex items-center justify-center">
        {item.image && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center opacity-40">
            <ImageOff className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">이미지 준비 중</span>
          </div>
        )}
        
        {/* Type Badge */}
        <div className={cn(
          "absolute top-2 left-2 px-2 py-1 flex items-center gap-1 rounded text-[10px] font-bold shadow-sm",
          getBadgeColor(item.itemType)
        )}>
          {getIcon(item.itemType)}
          {getLabel(item.itemType)}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2 min-w-0">
        <div className="flex flex-col gap-1">
          <h4 className="font-bold text-foreground text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h4>
          {item.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-snug">
              {item.summary}
            </p>
          )}
        </div>

        {/* Location Info */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto pt-2">
          <MapPin className="w-3.5 h-3.5" />
          <span className="font-medium truncate">
            {item.regionName}
          </span>
          <span className="text-[10px] ml-auto bg-muted px-1.5 py-0.5 rounded text-muted-foreground/80">
            상세 보기
          </span>
        </div>
      </div>
    </Link>
  );
}
