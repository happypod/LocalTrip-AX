"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Phone, MessageCircle, Globe, CalendarCheck, MessageSquare } from "lucide-react";
import { trackLeadEvent, LeadActionType } from "@/lib/lead-event";
import { InquiryDialog } from "@/components/inquiry/inquiry-dialog";

interface ExperienceCTAProps {
  itemId: string;
  itemSlug: string;
  phone?: string | null;
  kakaoUrl?: string | null;
  naverBookingUrl?: string | null;
  websiteUrl?: string | null;
}

export function ExperienceCTA({ itemId, itemSlug, phone, kakaoUrl, naverBookingUrl, websiteUrl }: ExperienceCTAProps) {
  const handleTrack = (actionType: LeadActionType, targetUrl?: string) => {
    trackLeadEvent({
      itemType: "experience",
      itemId,
      itemSlug,
      actionType,
      targetUrl,
    });
  };
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {phone && (
          <a
            href={`tel:${phone}`}
            onClick={() => handleTrack("phone_click", `tel:${phone}`)}
            className={cn(buttonVariants({ size: "xl" }), "w-full rounded-xl flex items-center justify-center gap-2")}
          >
            <Phone className="w-5 h-5" />
            전화 문의
          </a>
        )}
        {kakaoUrl && (
          <a
            href={kakaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleTrack("kakao_click", kakaoUrl)}
            className={cn(
              buttonVariants({ variant: "outline", size: "xl" }),
              "w-full rounded-xl border-[#FAE100] bg-[#FAE100] text-[#3C1E1E] hover:bg-[#FAE100]/90 hover:text-[#3C1E1E] flex items-center justify-center gap-2"
            )}
          >
            <MessageCircle className="w-5 h-5" />
            카카오 문의
          </a>
        )}
        {naverBookingUrl && (
          <a
            href={naverBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleTrack("naver_booking_click", naverBookingUrl)}
            className={cn(
              buttonVariants({ variant: "outline", size: "xl" }),
              "w-full rounded-xl border-[#03C75A] text-[#03C75A] hover:bg-[#03C75A]/10 flex items-center justify-center gap-2"
            )}
          >
            <CalendarCheck className="w-5 h-5" />
            네이버에서 확인
          </a>
        )}
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleTrack("homepage_click", websiteUrl)}
            className={cn(buttonVariants({ variant: "outline", size: "xl" }), "w-full rounded-xl flex items-center justify-center gap-2")}
          >
            <Globe className="w-5 h-5" />
            운영자 페이지 보기
          </a>
        )}
      </div>

      <div className="mt-4 p-4 border border-dashed rounded-xl flex flex-col items-center gap-2 bg-muted/20">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-medium">플랫폼 통합 문의</span>
        </div>
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          운영일과 참여 가능 여부는 문의를 통해 확인해 주세요.
        </p>
        <InquiryDialog 
          itemType="experience"
          itemId={itemId}
          itemSlug={itemSlug}
          variant="secondary"
          className="w-full mt-1 rounded-lg"
        />
      </div>
    </div>
  );
}
