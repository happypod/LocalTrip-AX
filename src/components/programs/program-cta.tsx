"use client";

import { Phone, MessageCircle, ExternalLink, CalendarDays } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackLeadEvent, LeadActionType } from "@/lib/lead-event";
import { InquiryDialog } from "@/components/inquiry/inquiry-dialog";

interface ProgramCTAProps {
  itemId: string;
  itemSlug: string;
  phone?: string | null;
  kakaoUrl?: string | null;
  naverBookingUrl?: string | null;
  websiteUrl?: string | null;
}

export function ProgramCTA({ itemId, itemSlug, phone, kakaoUrl, naverBookingUrl, websiteUrl }: ProgramCTAProps) {
  const handleTrack = (actionType: LeadActionType, targetUrl?: string) => {
    trackLeadEvent({
      itemType: "local_income_program",
      itemId,
      itemSlug,
      actionType,
      targetUrl,
    });
  };

  const hasContact = phone || kakaoUrl || naverBookingUrl || websiteUrl;

  return (
    <div className="bg-card border rounded-xl p-5 md:p-6 shadow-sm">
      <h3 className="font-bold text-lg mb-4 text-foreground">운영 문의 및 연결</h3>
      
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        이 프로그램은 주민들이 직접 운영하는 로컬소득 모델입니다. 상세 운영 일정과 참여 방법은 아래 채널로 문의해 주세요.
      </p>

      {hasContact ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {phone && (
              <a
                href={`tel:${phone.replace(/[^0-9]/g, "")}`}
                onClick={() => handleTrack("phone_click", `tel:${phone.replace(/[^0-9]/g, "")}`)}
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full sm:flex-1 bg-gray-900 hover:bg-gray-800 text-white")}
              >
                <Phone className="w-4 h-4 mr-2" />
                전화 문의
              </a>
            )}
            
            {kakaoUrl && (
              <a
                href={kakaoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleTrack("kakao_click", kakaoUrl)}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:flex-1 bg-[#FEE500] hover:bg-[#FEE500]/90 text-black border-transparent hover:border-transparent")}
              >
                <MessageCircle className="w-4 h-4 mr-2 fill-black" />
                카카오 문의
              </a>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {naverBookingUrl && (
              <a
                href={naverBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleTrack("naver_booking_click", naverBookingUrl)}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:flex-1 text-[#03C75A] border-[#03C75A]/30 hover:bg-[#03C75A]/5")}
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                네이버예약에서 확인
              </a>
            )}
            
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleTrack("homepage_click", websiteUrl)}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:flex-1")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                운영자 페이지 보기
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-muted/50 rounded-lg p-6 text-center border border-dashed">
          <p className="text-muted-foreground text-sm">연결 가능한 채널을 확인 중입니다.</p>
        </div>
      )}

      {/* Inquiry Dialog */}
      <div className="mt-6 pt-5 border-t border-dashed">
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">플랫폼 직접 문의</p>
          <p className="text-xs text-muted-foreground mb-3">
            주민 운영 프로그램은 일정과 운영 방식이 달라질 수 있습니다.<br/>문의를 남기면 확인 후 안내드립니다.
          </p>
          <InquiryDialog 
            itemType="local_income_program"
            itemId={itemId}
            itemSlug={itemSlug}
            variant="secondary"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
