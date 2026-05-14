"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { InquiryStatus, PartnerApplication, Region } from "@prisma/client";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  Mail,
  Phone,
  Store,
  User,
} from "lucide-react";
import { InquiryStatusSelect } from "@/components/admin/inquiry-status-select";
import { updatePremiumPrApplicationStatus } from "@/app/admin/premium-pr-applications/actions";

type PremiumPrApplicationWithRegion = PartnerApplication & {
  region: Region;
};

interface PremiumPrApplicationDetailProps {
  application: PremiumPrApplicationWithRegion;
}

export function PremiumPrApplicationDetail({
  application,
}: PremiumPrApplicationDetailProps) {
  const [status, setStatus] = useState(application.status);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: InquiryStatus) => {
    setIsPending(true);
    setError(null);
    setSuccess(null);

    try {
      await updatePremiumPrApplicationStatus(application.id, newStatus);
      setStatus(newStatus);
      setSuccess("상태가 업데이트되었습니다.");
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : "상태 변경 중 오류가 발생했습니다."
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Link
        href="/admin/premium-pr-applications"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-950"
      >
        <ArrowLeft className="h-4 w-4" />
        목록으로 돌아가기
      </Link>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle className="mr-2 h-4 w-4" />
          {success}
        </div>
      )}

      <div className="flex flex-col gap-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-center">
          <div>
            <span className="rounded-full bg-primary/5 px-2.5 py-1 text-xs font-black text-primary">
              {application.region.name} · Premium PR 제작 문의
            </span>
            <h1 className="mt-2 text-xl font-black text-gray-950">
              {application.businessName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">
              처리 상태
            </span>
            <InquiryStatusSelect
              status={status}
              onChange={handleStatusChange}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
              신청자 정보
            </h2>
            <InfoRow
              icon={<Store className="h-4 w-4" />}
              label="사업장/단체명"
              value={application.businessName}
            />
            <InfoRow
              icon={<User className="h-4 w-4" />}
              label="신청자"
              value={application.applicantName}
            />
            <InfoRow
              icon={<Briefcase className="h-4 w-4" />}
              label="문의 유형"
              value={application.businessType || "-"}
            />
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
              연락 및 접수 정보
            </h2>
            <InfoRow
              icon={<Phone className="h-4 w-4" />}
              label="연락처"
              value={application.phone}
            />
            <InfoRow
              icon={<Mail className="h-4 w-4" />}
              label="이메일"
              value={application.email || "-"}
            />
            <InfoRow
              icon={<Calendar className="h-4 w-4" />}
              label="접수 일시"
              value={new Date(application.createdAt).toLocaleString("ko-KR")}
            />
          </div>
        </div>

        <div className="w-fit rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          <span className="font-semibold">개인정보 동의 여부: </span>
          <span
            className={
              application.privacyConsent ? "text-emerald-600" : "text-red-600"
            }
          >
            {application.privacyConsent ? "동의" : "미동의"}
          </span>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 pt-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
            신청 내용 원문
          </h2>
          <div className="whitespace-pre-wrap rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">
            {application.message || "상세 메시지가 없습니다."}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-700">
      <span className="text-gray-400">{icon}</span>
      <span className="w-24 shrink-0 font-semibold">{label}</span>
      <span className="font-medium text-gray-950">{value}</span>
    </div>
  );
}
