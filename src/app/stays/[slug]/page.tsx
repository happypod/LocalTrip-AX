import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { FALLBACK_STAYS } from "@/lib/stay-data";
import { StayImage } from "@/components/stays/stay-image";
import { StayCTA } from "@/components/stays/stay-cta";
import { MapPin, Users, Info, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getStayBySlug(slug: string) {
  try {
    const prisma = getPrisma();
    await prisma.$connect();

    const sowonRegion = await prisma.region.findUnique({
      where: { slug: "sowon" },
      select: { id: true },
    });

    if (!sowonRegion) {
      return FALLBACK_STAYS.find((s) => s.slug === slug && s.status === "published");
    }

    const stay = await prisma.accommodation.findFirst({
      where: {
        slug,
        status: "published",
        regionId: sowonRegion.id,
      },
    });

    if (stay) return stay;
    
    // Check fallback if not found in DB
    return FALLBACK_STAYS.find((s) => s.slug === slug && s.status === "published");
  } catch (error) {
    console.warn(`Failed to fetch stay ${slug} from DB, using fallback:`, error);
    return FALLBACK_STAYS.find((s) => s.slug === slug && s.status === "published");
  }
}

export default async function StayDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stay = await getStayBySlug(slug);

  if (!stay) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="max-w-screen-md mx-auto w-full">
        {/* Navigation */}
        <div className="px-6 py-4 flex items-center">
          <Link
            href="/stays"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1 -ml-2 text-muted-foreground")}
          >
            <ChevronLeft className="w-4 h-4" />
            숙소 목록
          </Link>
        </div>

        {/* Hero Section */}
        <section className="px-6">
          <StayImage
            src={stay.images?.[0]}
            alt={stay.title}
            className="rounded-2xl shadow-sm"
          />
        </section>

        {/* Content Section */}
        <main className="px-6 py-8 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {stay.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {stay.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-y">
            {stay.address && (
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-muted rounded-lg">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">주소</span>
                  <span className="text-sm font-medium">{stay.address}</span>
                </div>
              </div>
            )}
            {stay.capacityText && (
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-muted rounded-lg">
                  <Users className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">인원</span>
                  <span className="text-sm font-medium">{stay.capacityText}</span>
                </div>
              </div>
            )}
            {stay.priceText && (
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-muted rounded-lg">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">가격</span>
                  <span className="text-sm font-medium font-bold text-primary">{stay.priceText}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">소개</h2>
            <div className="text-muted-foreground leading-loose whitespace-pre-wrap">
              {stay.description || stay.summary}
            </div>
          </div>

          {/* CTA Section */}
          <section className="mt-8 p-6 bg-card border rounded-2xl shadow-sm">
            <div className="flex flex-col gap-4 mb-6">
              <h3 className="text-lg font-bold">문의 및 연결</h3>
              <p className="text-xs text-muted-foreground">
                이 숙소는 로컬트립 파트너가 직접 운영합니다. 
                예약 문의나 궁금한 점은 아래 채널로 직접 연락해 주세요.
              </p>
            </div>
            <StayCTA
              phone={stay.phone}
              kakaoUrl={stay.kakaoUrl}
              naverBookingUrl={stay.naverBookingUrl}
              websiteUrl={stay.websiteUrl}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
