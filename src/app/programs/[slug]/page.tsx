import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { getLocalizedContent } from "@/lib/content-translation";
import { getServerTranslationLocale } from "@/lib/server-translation";
import { PublishStatus } from "@prisma/client";
import type { LocalIncomeProgramUI } from "@/lib/program-data";
import { getStaticLabels, getLocalizedCategory } from "@/lib/static-translations";
import { ProgramImage } from "@/components/programs/program-image";
import { ProgramCTA } from "@/components/programs/program-cta";
import { MapPin, Clock, Users, ChevronLeft, AlertCircle, HeartHandshake, Sprout, HandCoins } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getProgramBySlug(slug: string): Promise<LocalIncomeProgramUI | undefined> {
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

    const program = await prisma.localIncomeProgram.findFirst({
      where: {
        slug,
        status: PublishStatus.published,
        regionId: sowonRegion.id,
      },
    });

    if (program) {
      const currentLocale = await getServerTranslationLocale();

      if (currentLocale !== "ko") {
        const translations = await prisma.contentTranslation.findMany({
          where: {
            targetType: "local_income_program",
            targetId: program.id,
            locale: { in: [currentLocale, "en"] }
          }
        });

        return getLocalizedContent(program as LocalIncomeProgramUI, translations, currentLocale);
      }
      return program as LocalIncomeProgramUI;
    }

    return undefined;
  } catch (error) {
    console.warn(`Failed to fetch program ${slug} from DB:`, error);
    return undefined;
  }
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prog = await getProgramBySlug(slug);

  if (!prog) {
    notFound();
  }

  const currentLocale = await getServerTranslationLocale();
  const t = getStaticLabels(currentLocale);
  const localizedCategory = getLocalizedCategory(prog.category, currentLocale);

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-muted/10">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-screen-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/programs" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" />
            {t.backToPrograms}
          </Link>
          <Link href="/" className="text-xs text-muted-foreground hover:underline">{t.home}</Link>
        </div>
      </header>

      <main className="max-w-screen-md mx-auto w-full">
        {/* Main Image */}
        <div className="relative">
          <ProgramImage src={prog.images?.[0]} alt={prog.title} />
          {localizedCategory && (
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-category-program text-white text-[11px] font-bold rounded-lg uppercase tracking-wider shadow-lg">
              {localizedCategory}
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col gap-8 bg-background">
          {/* Header Info */}
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-foreground">
              {prog.title}
            </h1>
            <p className="text-muted-foreground leading-relaxed text-[15px]">
              {prog.summary}
            </p>
          </div>

          <hr className="border-muted" />

          {/* Special Core Focus Blocks */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-foreground mb-1">{t.specialPoint}</h2>

            {/* 1. Life Service Connection */}
            <div className="bg-category-program/5 border border-category-program/20 rounded-xl p-5 flex gap-4 items-start shadow-sm">
              <div className="bg-category-program/10 p-2.5 rounded-full shrink-0">
                <HeartHandshake className="w-6 h-6 text-category-program" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-bold text-foreground text-[15px]">{t.lifeServiceTitle}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.lifeServicePrefix}<strong className="text-foreground">{prog.linkedLifeService}</strong>{t.lifeServiceSuffix}
                </p>
              </div>
            </div>

            {/* 2. Resident Role */}
            <div className="bg-category-program/5 border border-category-program/20 rounded-xl p-5 flex gap-4 items-start shadow-sm">
              <div className="bg-category-program/10 p-2.5 rounded-full shrink-0">
                <Users className="w-6 h-6 text-category-program" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-bold text-foreground text-[15px]">{t.residentRoleTitle}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.residentRolePrefix}<strong className="text-foreground">{prog.residentRole}</strong>{t.residentRoleSuffix}
                </p>
              </div>
            </div>

            {/* 3. Revenue Use */}
            <div className="bg-category-program/5 border border-category-program/20 rounded-xl p-5 flex gap-4 items-start shadow-sm">
              <div className="bg-category-program/10 p-2.5 rounded-full shrink-0">
                <HandCoins className="w-6 h-6 text-category-program" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-bold text-foreground text-[15px]">{t.revenueUseTitle}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {prog.revenueUse ? (
                    <>{t.revenueUsePrefix}<strong className="text-foreground">{prog.revenueUse}</strong>{t.revenueUseSuffix}</>
                  ) : (
                    t.revenueUseEmpty
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {prog.description && (
            <div className="mt-2">
              <h3 className="font-bold mb-3 text-foreground">{t.detailedDesc}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {prog.description}
              </p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 rounded-xl p-5 border">
            {prog.location && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {t.operatingLocation}
                </span>
                <span className="text-sm font-medium text-foreground">{getLocalizedCategory(prog.location, currentLocale)}</span>
              </div>
            )}

            {(prog.durationText || prog.capacityText) && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {t.durationAndCapacity}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {prog.durationText && `${getLocalizedCategory(prog.durationText, currentLocale)} `}
                  {prog.capacityText && `(${getLocalizedCategory(prog.capacityText, currentLocale)})`}
                </span>
              </div>
            )}

            {prog.meetingPoint && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {t.meetingPoint}
                </span>
                <span className="text-sm font-medium text-foreground">{prog.meetingPoint}</span>
              </div>
            )}

            {prog.priceText && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5" /> {t.participationCost}
                </span>
                <span className="text-sm font-medium text-foreground">{getLocalizedCategory(prog.priceText, currentLocale)}</span>
              </div>
            )}

            {prog.preparation && (
              <div className="flex flex-col gap-1 sm:col-span-2 mt-2">
                <span className="text-xs font-semibold text-muted-foreground">{t.preparation}</span>
                <span className="text-sm text-foreground">{prog.preparation}</span>
              </div>
            )}

            {prog.includes && (
              <div className="flex flex-col gap-1 sm:col-span-2 mt-2">
                <span className="text-xs font-semibold text-muted-foreground">{t.includes}</span>
                <span className="text-sm text-foreground">{prog.includes}</span>
              </div>
            )}

            {prog.excludes && (
              <div className="flex flex-col gap-1 sm:col-span-2 mt-2">
                <span className="text-xs font-semibold text-muted-foreground">{t.excludes}</span>
                <span className="text-sm text-foreground">{prog.excludes}</span>
              </div>
            )}
          </div>

          {/* Safety Notice */}
          {prog.safetyNotice && (
            <div className="bg-red-50/50 border border-red-200 rounded-xl p-4 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-red-700">{t.safetyNotice}</span>
                <span className="text-sm text-red-600/90 leading-relaxed">{prog.safetyNotice}</span>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-4">
            <ProgramCTA
              itemId={prog.id}
              itemSlug={prog.slug}
              phone={prog.phone}
              kakaoUrl={prog.kakaoUrl}
              naverBookingUrl={prog.naverBookingUrl}
              websiteUrl={prog.websiteUrl}
              locale={currentLocale}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
