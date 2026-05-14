"use client";

import { Phone, MessageCircle, ExternalLink, CalendarDays } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackLeadEvent, LeadActionType } from "@/lib/lead-event";
import { InquiryDialog } from "@/components/inquiry/inquiry-dialog";
import { getStaticLabels } from "@/lib/static-translations";

interface ProgramCTAProps {
  itemId: string;
  itemSlug: string;
  phone?: string | null;
  kakaoUrl?: string | null;
  naverBookingUrl?: string | null;
  websiteUrl?: string | null;
  locale?: string;
}

export function ProgramCTA({ itemId, itemSlug, phone, kakaoUrl, naverBookingUrl, websiteUrl, locale }: ProgramCTAProps) {
  const t = getStaticLabels(locale);
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
      <h3 className="font-bold text-lg mb-4 text-foreground">{t.contactTitle}</h3>
      
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        {t.progDesc}
      </p>

      {hasContact ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {phone && (
              <a
                href={`tel:${phone.replace(/[^0-9]/g, "")}`}
                onClick={() => handleTrack("phone_click", `tel:${phone.replace(/[^0-9]/g, "")}`)}
                className={cn(buttonVariants({ variant: "default", size: "xl" }), "w-full sm:flex-1 bg-gray-900 hover:bg-gray-800 text-white")}
              >
                <Phone className="w-4 h-4 mr-2" />
                {t.phoneCall}
              </a>
            )}
            
            {kakaoUrl && (
              <a
                href={kakaoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleTrack("kakao_click", kakaoUrl)}
                className={cn(buttonVariants({ variant: "outline", size: "xl" }), "w-full sm:flex-1 bg-[#FEE500] hover:bg-[#FEE500]/90 text-black border-transparent hover:border-transparent")}
              >
                <MessageCircle className="w-4 h-4 mr-2 fill-black" />
                {t.kakaoInquiry}
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
                className={cn(buttonVariants({ variant: "outline", size: "xl" }), "w-full sm:flex-1 text-[#03C75A] border-[#03C75A]/30 hover:bg-[#03C75A]/5")}
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                {t.naverBookingConfirm}
              </a>
            )}
            
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleTrack("homepage_click", websiteUrl)}
                className={cn(buttonVariants({ variant: "outline", size: "xl" }), "w-full sm:flex-1")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {t.opPage}
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-muted/50 rounded-lg p-6 text-center border border-dashed">
          <p className="text-muted-foreground text-sm">{t.checkingContact}</p>
        </div>
      )}

      {/* Inquiry Dialog */}
      <div className="mt-6 pt-5 border-t border-dashed">
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">{t.platformDirectInquiry}</p>
          <p className="text-xs text-muted-foreground mb-3 whitespace-pre-line">
            {t.platformDirectInquiryDesc}
          </p>
          <InquiryDialog 
            itemType="local_income_program"
            itemId={itemId}
            itemSlug={itemSlug}
            variant="secondary"
            className="w-full"
            buttonText={t.leaveInquiry}
          />
        </div>
      </div>
    </div>
  );
}
