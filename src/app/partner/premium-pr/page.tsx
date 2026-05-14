import Link from "next/link";
import {
  BadgeCheck,
  Camera,
  ChevronLeft,
  Cuboid,
  Plane,
  Video,
} from "lucide-react";
import { PremiumPrApplicationForm } from "@/components/partner/premium-pr-application-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "프리미엄 PR 제작 문의 | 소원로컬트립",
  description:
    "소원권역 숙소와 로컬 운영자를 위한 3D 투어, 호스트 영상, 드론 영상, 상세 PR 콘텐츠 제작 문의 페이지입니다.",
};

const PRODUCTION_ITEMS = [
  {
    title: "3D/VR 투어",
    description: "숙소와 공간을 미리 둘러볼 수 있는 랜선 투어 콘텐츠",
    icon: Cuboid,
  },
  {
    title: "호스트 이야기 영상",
    description: "운영자의 목소리로 공간과 마을의 이야기를 전달하는 영상",
    icon: Video,
  },
  {
    title: "드론 영상",
    description: "해안, 마을, 접근 동선을 한눈에 보여주는 항공 영상",
    icon: Plane,
  },
  {
    title: "상세 PR 콘텐츠",
    description: "사진, 소개 문안, 썸네일, 프리미엄 노출 운영 지원",
    icon: Camera,
  },
];

export default function PremiumPrApplyPage() {
  return (
    <div className="flex min-h-screen flex-col pb-20">
      <div className="mx-auto w-full max-w-screen-md">
        <div className="flex items-center px-6 py-4">
          <Link
            href="/partner/apply"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "-ml-2 gap-1 text-muted-foreground"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            입점신청으로
          </Link>
        </div>

        <header className="px-6 py-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-black text-primary">
            <BadgeCheck className="h-4 w-4" />
            B2B Premium PR
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            프리미엄 PR 제작 문의
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            지역 숙소와 로컬 운영자를 위한 3D 투어, 호스트 영상, 드론 영상,
            상세 홍보 콘텐츠 제작을 상담합니다. 접수 후 운영자가 연락드리며,
            결제나 촬영 일정이 자동 확정되지는 않습니다.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-3 px-6 sm:grid-cols-2">
          {PRODUCTION_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-3 text-sm font-black text-gray-950">
                  {item.title}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  {item.description}
                </p>
              </article>
            );
          })}
        </section>

        <main className="px-6 py-10">
          <PremiumPrApplicationForm />
        </main>
      </div>
    </div>
  );
}
