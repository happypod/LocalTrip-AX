import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { CertificationForm } from "@/components/admin/training/certification-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "인증항목 수정 | LocalTrip AX",
};

export const dynamic = "force-dynamic";

interface EditCertificationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCertificationPage({ params }: EditCertificationPageProps) {
  await requireAdminSession();
  const { id } = await params;

  const prisma = getPrisma();
  await prisma.$connect();

  const [cert, regions] = await Promise.all([
    prisma.certification.findUnique({
      where: { id },
    }),
    prisma.region.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!cert) {
    notFound();
  }

  const initialData = {
    id: cert.id,
    regionId: cert.regionId,
    title: cert.title,
    summary: cert.summary || undefined,
    status: cert.status,
  };

  return (
    <AdminShell title="인증항목 수정">
      <div className="flex flex-col gap-6 py-6 w-full max-w-xl mx-auto">
        <div className="flex flex-col gap-2 border-b pb-4">
          <Link 
            href="/admin/training" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2 w-fit"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            교육·인증 목록으로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">인증항목 수정</h1>
          <p className="text-sm text-gray-500">
            기존 우수 로컬 브랜드 및 공간 인증 정보를 안전하게 수정합니다.
          </p>
        </div>

        <CertificationForm initialData={initialData} regions={regions} />
      </div>
    </AdminShell>
  );
}
