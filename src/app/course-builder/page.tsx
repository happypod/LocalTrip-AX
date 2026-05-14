import type { Metadata } from "next";
import { CourseBuilderClient } from "@/components/course-builder/course-builder-client";
import { getCourseBuilderData } from "@/lib/course-builder-data";
import { getServerTranslationLocale } from "@/lib/server-translation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "맞춤코스 만들기 | LocalTrip AX",
  description: "숙박, 체험, 주민소득상품을 조합해 임시 소원권역 코스를 만드는 게스트용 도구입니다.",
};

export default async function CourseBuilderPage() {
  const locale = await getServerTranslationLocale();
  const data = await getCourseBuilderData(locale);

  return <CourseBuilderClient data={data} locale={locale} />;
}
