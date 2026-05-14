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

        <section className="px-6 pb-8">
          <div className="rounded-3xl border border-primary/15 bg-primary/5 p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">
              Premium PR
            </p>
            <h2 className="mt-2 text-lg font-black text-foreground">
              3D 투어·영상 제작이 필요하신가요?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              숙소와 로컬 운영자를 위한 프리미엄 PR 제작대행 문의는 별도
              신청 폼으로 접수합니다.
            </p>
            <Link
              href="/partner/premium-pr"
              className={cn(
                buttonVariants({ size: "sm" }),
                "mt-4 rounded-xl"
              )}
            >
              프리미엄 PR 제작 문의
            </Link>
          </div>
        </section>

        {/* Form Section */}
        <main className="px-6 pb-12">
          <PartnerApplyForm />
        </main>
      </div>
    </div>
  );
}
