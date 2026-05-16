import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { getLocalizedContent } from "@/lib/content-translation";
import { getServerTranslationLocale } from "@/lib/server-translation";
import { getStaticLabels, getLocalizedCategory } from "@/lib/static-translations";
import { StayImage } from "@/components/stays/stay-image";
import { StayCTA } from "@/components/stays/stay-cta";
import {
  PremiumPrHeroBadge,
  PremiumPrSection,
} from "@/components/stays/premium-pr-section";
import { MapPin, Users, Info, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getStayBySlug(slug: string, currentLocale: string) {
  try {
    const prisma = getPrisma();
    await prisma.$connect();

    const sowonRegion = await prisma.region.findUnique({
      where: { slug: "sowon" },
      select: { id: true },
    });

    if (!sowonRegion) {
      return undefined;
    }

    const stay = await prisma.accommodation.findFirst({
      where: {
        slug,
        status: "published",
        regionId: sowonRegion.id,
      },
    });

    if (stay) {
      if (currentLocale !== "ko") {
        const translations = await prisma.contentTranslation.findMany({
          where: {
            targetType: "accommodation",
            targetId: stay.id,
            locale: { in: [currentLocale, "en"] }
          }
        });

        return getLocalizedContent(stay, translations, currentLocale);
      }

      return stay;
    }
    return undefined;
  } catch (error) {
    console.warn(`Failed to fetch stay ${slug} from DB:`, error);
    return undefined;
  }
}

export default async function StayDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const currentLocale = await getServerTranslationLocale();
  const stay = await getStayBySlug(slug, currentLocale);

  if (!stay) {
    notFound();
  }

  const labels = getStaticLabels(currentLocale);

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
            {labels.backToList}
          </Link>
        </div>

        {/* Hero Section */}
        <section className="px-6">
          <div className="relative">
            <StayImage
              src={stay.images?.[0]}
              alt={stay.title}
              className="rounded-2xl shadow-sm"
            />
            <PremiumPrHeroBadge
              premiumPr={stay.premiumPr}
              stayTitle={stay.title}
              itemId={stay.id}
              itemSlug={stay.slug}
            />
          </div>
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
                  <span className="text-xs font-semibold text-muted-foreground uppercase">{labels.address}</span>
                  <span className="text-sm font-medium">{getLocalizedCategory(stay.address, currentLocale)}</span>
                </div>
              </div>
            )}
            {stay.capacityText && (
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-muted rounded-lg">
                  <Users className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">{labels.capacity}</span>
                  <span className="text-sm font-medium">{getLocalizedCategory(stay.capacityText, currentLocale)}</span>
                </div>
              </div>
            )}
            {stay.priceText && (
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-muted rounded-lg">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">{labels.price}</span>
                  <span className="text-sm font-medium font-bold text-primary">{getLocalizedCategory(stay.priceText, currentLocale)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">{labels.introduction}</h2>
            <div className="text-muted-foreground leading-loose whitespace-pre-wrap">
              {stay.description || stay.summary}
            </div>
          </div>

          {/* Image Gallery Section */}
          {stay.images && stay.images.length > 1 && (
            <div className="flex flex-col gap-6 py-8 border-t">
              <h2 className="text-xl font-bold">공간과 분위기</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stay.images[1] && (
                  <div className="flex flex-col gap-2">
                    <StayImage src={stay.images[1]} alt={`${stay.title} 분위기`} className="rounded-xl overflow-hidden" />
                    <span className="text-sm text-muted-foreground font-medium text-center">지역과 어우러진 분위기</span>
                  </div>
                )}
                {stay.images[2] && (
                  <div className="flex flex-col gap-2">
                    <StayImage src={stay.images[2]} alt={`${stay.title} 상세`} className="rounded-xl overflow-hidden" />
                    <span className="text-sm text-muted-foreground font-medium text-center">공간의 디테일</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <PremiumPrSection
            premiumPr={stay.premiumPr}
            stayTitle={stay.title}
            itemId={stay.id}
            itemSlug={stay.slug}
          />

          {/* CTA Section */}
          <section className="mt-8 p-6 bg-card border rounded-2xl shadow-sm">
            <div className="flex flex-col gap-4 mb-6">
              <h3 className="text-lg font-bold">{labels.contactTitle}</h3>
              <p className="text-xs text-muted-foreground">
                {labels.contactDesc}
              </p>
            </div>
            <StayCTA
              itemId={stay.id}
              itemSlug={stay.slug}
              phone={stay.phone}
              kakaoUrl={stay.kakaoUrl}
              naverBookingUrl={stay.naverBookingUrl}
              websiteUrl={stay.websiteUrl}
              locale={currentLocale}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
