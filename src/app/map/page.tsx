import { getMapItems } from "@/lib/map-data";
import { PublicMapClient } from "@/components/map/public-map-client";
import { ChevronRight, Info, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface MapPageProps {
  searchParams: Promise<{
    q?: string;
    date?: string;
    guests?: string;
    type?: string;
  }>;
}

export default async function MapPage({ searchParams }: MapPageProps) {
  const { q, date, guests, type } = await searchParams;
  const { items, isFallback, source } = await getMapItems();

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <header className="px-6 py-8 sm:py-12 bg-muted/20 border-b">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link href="/" className="hover:text-foreground">홈</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">지도 탐색</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">소원권역 지도 탐색</h1>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            숙소, 체험, 주민소득상품, 추천 코스를 권역별로 살펴보세요.
          </p>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-screen-xl mx-auto w-full flex flex-col gap-6">

        {/* T-010 Rule Message */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm leading-relaxed text-foreground/80 shadow-sm flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p>
            이 지도는 <strong>차량 배차나 이동수단 예약이 아닙니다.</strong><br/>
            소원권역에서 머물 곳과 주변 도보권 및 현장 집결 중심으로 즐길 수 있는 로컬 프로그램을 탐색하기 위한 화면입니다.
          </p>
        </div>

        {isFallback && source === "error" && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 text-sm leading-relaxed text-destructive/80 shadow-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p>
              현재 지도 데이터를 실시간으로 불러오는 중 통신 오류가 발생했거나 점검 중입니다.<br/>
              콘텐츠 이용에 참고 부탁드리며, 문제가 지속될 시 고객센터로 문의해 주세요.
            </p>
          </div>
        )}
        {isFallback && source === "empty" && (
          <div className="bg-muted/40 border border-muted rounded-xl p-4 text-sm leading-relaxed text-muted-foreground shadow-sm flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <p>현재 등록된 콘텐츠가 없습니다. 운영자가 준비 중입니다.</p>
          </div>
        )}

        {/* Interactive Map Shell (Client Component) */}
        <PublicMapClient
          initialItems={items}
          initialQuery={q}
          initialDate={date}
          initialGuests={guests}
          initialType={type}
        />

      </main>
    </div>
  );
}

