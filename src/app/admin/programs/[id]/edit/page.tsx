import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPrisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import {
  ContentTranslationMetadata,
  isContentTranslationMetadata,
} from "@/lib/content-translation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProgramForm } from "@/components/admin/programs/program-form";
import { TranslationForm } from "@/components/admin/translations/translation-form";

export const dynamic = "force-dynamic";

interface EditProgramPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ProgramTranslationData {
  title: string | null;
  summary: string | null;
  description: string | null;
  address?: string | null;
  capacityText?: string | null;
  priceText?: string | null;
  linkedLifeService?: string | null;
  residentRole?: string | null;
  revenueUse?: string | null;
}

function getMetadataField(
  metadata: unknown,
  field: keyof ContentTranslationMetadata
) {
  if (!isContentTranslationMetadata(metadata)) {
    return null;
  }

  const value = metadata[field];
  return typeof value === "string" ? value : null;
}

export default async function EditProgramPage({ params }: EditProgramPageProps) {
  await requireAdminSession();
  const { id } = await params;
  const prisma = getPrisma();

  const [program, regions, businesses, translations] = await Promise.all([
    prisma.localIncomeProgram.findUnique({
      where: { id },
    }),
    prisma.region.findMany({
      orderBy: { createdAt: "asc" },
    }),
    prisma.businessProfile.findMany({
      orderBy: { createdAt: "asc" },
    }),
    prisma.contentTranslation.findMany({
      where: { targetType: "local_income_program", targetId: id },
    }),
  ]);

  if (!program) {
    notFound();
  }

  const existingTranslations = translations.reduce(
    (acc, translation) => {
      acc[translation.locale] = {
        title: translation.title,
        summary: translation.summary,
        description: translation.description,
        address: getMetadataField(translation.metadata, "address"),
        capacityText: getMetadataField(translation.metadata, "capacityText"),
        priceText: getMetadataField(translation.metadata, "priceText"),
        linkedLifeService: getMetadataField(
          translation.metadata,
          "linkedLifeService"
        ),
        residentRole: getMetadataField(translation.metadata, "residentRole"),
        revenueUse: getMetadataField(translation.metadata, "revenueUse"),
      };
      return acc;
    },
    {} as Record<string, ProgramTranslationData>
  );

  return (
    <AdminShell title="주민소득상품 수정">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 py-6">
        <div className="flex flex-col gap-4">
          <Link
            href="/admin/programs"
            className="flex w-fit items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>목록으로 돌아가기</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              주민소득상품 수정
            </h1>
            <p className="mt-1 text-gray-500">
              등록된 주민소득상품 정보와 다국어 번역을 수정합니다.
            </p>
          </div>
        </div>

        <ProgramForm
          initialData={program}
          regions={regions}
          businesses={businesses}
        />

        <TranslationForm
          targetType="local_income_program"
          targetId={program.id}
          originalData={{
            title: program.title,
            summary: program.summary,
            description: program.description,
            address: program.location,
            capacityText: program.capacityText,
            priceText: program.priceText,
            linkedLifeService: program.linkedLifeService,
            residentRole: program.residentRole,
            revenueUse: program.revenueUse,
          }}
          existingTranslations={existingTranslations}
        />
      </div>
    </AdminShell>
  );
}
