import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Phone, MessageCircle, Globe, CalendarCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StayCTAProps {
  phone?: string | null;
  kakaoUrl?: string | null;
  naverBookingUrl?: string | null;
  websiteUrl?: string | null;
}

export function StayCTA({ phone, kakaoUrl, naverBookingUrl, websiteUrl }: StayCTAProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {phone && (
          <a
            href={`tel:${phone}`}
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
            className={cn(
              buttonVariants({ variant: "outline", size: "xl" }),
              "w-full rounded-xl border-[#03C75A] text-[#03C75A] hover:bg-[#03C75A]/10 flex items-center justify-center gap-2"
            )}
          >
            <CalendarCheck className="w-5 h-5" />
            네이버 예약
          </a>
        )}
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "xl" }), "w-full rounded-xl flex items-center justify-center gap-2")}
          >
            <Globe className="w-5 h-5" />
            홈페이지 방문
          </a>
        )}
      </div>

      <div className="mt-4 p-4 border border-dashed rounded-xl flex flex-col items-center gap-2 bg-muted/20">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-medium">플랫폼 직접 문의</span>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          현재 시스템 점검 중입니다. 상단 연락처를 통해 직접 문의해 주세요.
        </p>
        <Button disabled variant="secondary" className="w-full mt-1 rounded-lg">
          문의폼 준비 중
        </Button>
      </div>
    </div>
  );
}
