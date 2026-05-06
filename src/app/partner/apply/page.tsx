import { PartnerApplyForm } from "@/components/partner/partner-apply-form";
import { ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "입점신청 | 소원로컬트립",
  description: "소원권역의 숙소, 체험, 로컬밥상, 주민소득 프로그램, 로컬상품을 함께 소개할 운영자를 모집합니다.",
};

export default function PartnerApplyPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="max-w-screen-md mx-auto w-full">
        {/* Navigation */}
        <div className="px-6 py-4 flex items-center">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1 -ml-2 text-muted-foreground")}
          >
            <ChevronLeft className="w-4 h-4" />
            홈으로
          </Link>
        </div>

        {/* Hero Section */}
        <header className="px-6 py-10 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              소원로컬트립 입점신청
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              소원권역의 숙소, 체험, 로컬밥상, 주민소득 프로그램, 로컬상품을 함께 소개할 운영자를 모집합니다.
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-primary">안내 사항</span>
              <p className="text-xs text-primary/80 leading-relaxed">
                이 페이지는 관광객 문의가 아니라, 숙소·체험·주민소득상품 운영자의 <strong>입점신청 전용 페이지</strong>입니다.
                관광객 문의는 각 상세 페이지의 &apos;문의 남기기&apos; 버튼을 이용해 주세요.
              </p>
            </div>
          </div>
        </header>

        {/* Form Section */}
        <main className="px-6 pb-12">
          <PartnerApplyForm />
        </main>
      </div>
    </div>
  );
}
