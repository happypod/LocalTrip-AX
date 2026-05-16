import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { getLocalizedContent } from "@/lib/content-translation";
import { getServerTranslationLocale } from "@/lib/server-translation";
import { PublishStatus } from "@prisma/client";
import type { ExperienceUI } from "@/lib/experience-data";
import { getStaticLabels, getLocalizedCategory } from "@/lib/static-translations";
import { ExperienceImage } from "@/components/experiences/experience-image";
import { ExperienceCTA } from "@/components/experiences/experience-cta";
import { MapPin, Clock, Users, Info, ChevronLeft, AlertCircle, CheckCircle2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getExperienceBySlug(slug: string): Promise<ExperienceUI | undefined> {
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

    const experience = await prisma.experience.findFirst({
      where: {
        slug,
        status: PublishStatus.published,
        regionId: sowonRegion.id,
      },
    });

    if (experience) {
      const currentLocale = await getServerTranslationLocale();

      if (currentLocale !== "ko") {
        const translations = await prisma.contentTranslation.findMany({
          where: {
            targetType: "experience",
            targetId: experience.id,
            locale: { in: [currentLocale, "en"] }
          }
        });

        return getLocalizedContent(experience as ExperienceUI, translations, currentLocale);
      }
      return experience as ExperienceUI;
    }

    return undefined;
  } catch (error) {
    console.warn(`Failed to fetch experience ${slug} from DB:`, error);
    return undefined;
  }
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exp = await getExperienceBySlug(slug);

  if (!exp) {
    notFound();
  }

  const currentLocale = await getServerTranslationLocale();
  const t = getStaticLabels(currentLocale);
  const localizedCategory = getLocalizedCategory(exp.category, currentLocale);

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="max-w-screen-md mx-auto w-full">
        {/* Navigation */}
        <div className="px-6 py-4 flex items-center">
          <Link
            href="/experiences"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1 -ml-2 text-muted-foreground")}
          >
            <ChevronLeft className="w-4 h-4" />
            {t.backToExperiences}
          </Link>
        </div>

        {/* Hero Section */}
        <section className="px-6 relative">
          <ExperienceImage
            src={exp.images?.[0]}
            alt={exp.title}
            className="rounded-2xl shadow-sm"
          />
          {localizedCategory && (
            <div className="absolute top-10 left-10 px-3 py-1.5 bg-category-experience text-white text-[11px] font-bold rounded-lg uppercase tracking-wider shadow-lg">
              {localizedCategory}
            </div>
          )}
        </section>

        {/* Content Section */}
        <main className="px-6 py-8 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {exp.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {exp.summary}
            </p>
          </div>

          {/* Meta Info Grid */}
          <div className="grid grid-cols-2 gap-4 py-6 border-y">
            {exp.location && (
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-muted rounded-lg">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{t.location}</span>
                  <span className="text-sm font-medium">{getLocalizedCategory(exp.location, currentLocale)}</span>
                </div>
              </div>
            )}
            {exp.durationText && (
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-muted rounded-lg">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{t.duration}</span>
                  <span className="text-sm font-medium">{getLocalizedCategory(exp.durationText, currentLocale)}</span>
                </div>
              </div>
            )}
            {exp.capacityText && (
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-muted rounded-lg">
                  <Users className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{t.capacity}</span>
                  <span className="text-sm font-medium">{getLocalizedCategory(exp.capacityText, currentLocale)}</span>
                </div>
              </div>
            )}
            {exp.priceText && (
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-muted rounded-lg">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{t.price}</span>
                  <span className="text-sm font-bold text-primary">{getLocalizedCategory(exp.priceText, currentLocale)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold">{t.programIntro}</h2>
              <div className="text-muted-foreground leading-loose whitespace-pre-wrap">
                {exp.description || exp.summary}
              </div>
            </div>

            {/* Image Gallery Section */}
            {exp.images && exp.images.length > 1 && (
              <div className="flex flex-col gap-6 py-8 border-t">
                <h2 className="text-xl font-bold">생생한 현장 스케치</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exp.images[1] && (
                    <div className="flex flex-col gap-2">
                      <ExperienceImage src={exp.images[1]} alt={`${exp.title} 분위기`} className="rounded-xl overflow-hidden" />
                      <span className="text-sm text-muted-foreground font-medium text-center">함께 즐기는 순간</span>
                    </div>
                  )}
                  {exp.images[2] && (
                    <div className="flex flex-col gap-2">
                      <ExperienceImage src={exp.images[2]} alt={`${exp.title} 상세`} className="rounded-xl overflow-hidden" />
                      <span className="text-sm text-muted-foreground font-medium text-center">체험의 디테일</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Practical Info */}
            <div className="grid grid-cols-1 gap-6 bg-muted/30 p-6 rounded-2xl">
              {exp.meetingPoint && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    {t.meetingPoint}
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{exp.meetingPoint}</p>
                </div>
              )}
              {exp.preparation && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                    {t.preparation}
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{exp.preparation}</p>
                </div>
              )}
              {exp.includes && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {t.includes}
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{exp.includes}</p>
                </div>
              )}
            </div>

            {exp.safetyNotice && (
              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-destructive">{t.safetyNotice}</span>
                  <p className="text-xs text-destructive/80 leading-relaxed">{exp.safetyNotice}</p>
                </div>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <section className="mt-8 p-6 bg-card border rounded-2xl shadow-sm">
            <div className="flex flex-col gap-4 mb-6">
              <h3 className="text-lg font-bold">{t.contactTitle}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t.expDesc}
              </p>
            </div>
            <ExperienceCTA
              itemId={exp.id}
              itemSlug={exp.slug}
              phone={exp.phone}
              kakaoUrl={exp.kakaoUrl}
              naverBookingUrl={exp.naverBookingUrl}
              websiteUrl={exp.websiteUrl}
              locale={currentLocale}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
