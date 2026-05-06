"use client";

import { useState } from "react";
import Link from "next/link";
import { PartnerApplication, Region, InquiryStatus } from "@prisma/client";
import { InquiryStatusSelect } from "@/components/admin/inquiry-status-select";
import { updatePartnerApplicationStatus } from "@/app/admin/partner-applications/actions";
import { ArrowLeft, Calendar, Mail, Phone, User, CheckCircle, Briefcase, Store } from "lucide-react";

type PartnerApplicationWithRelations = PartnerApplication & {
  region: Region;
};

interface PartnerApplicationDetailProps {
  application: PartnerApplicationWithRelations;
}

export function PartnerApplicationDetail({ application }: PartnerApplicationDetailProps) {
  const [status, setStatus] = useState(application.status);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: InquiryStatus) => {
    setIsPending(true);
    setError(null);
    setSuccess(null);

    try {
      await updatePartnerApplicationStatus(application.id, newStatus);
      setStatus(newStatus);
      setSuccess("상태가 성공적으로 업데이트되었습니다.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "상태 변경 중 오류가 발생했습니다.");
      } else {
        setError("상태 변경 중 오류가 발생했습니다.");
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* 뒤로가기 링크 */}
      <div>
        <Link
          href="/admin/partner-applications"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> 목록으로 돌아가기
        </Link>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 text-sm text-emerald-600 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" /> {success}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col gap-8">
        {/* 헤더 및 상태 수정 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold text-primary px-2.5 py-1 bg-primary/5 rounded-full">
              {application.region.name} 권역
            </span>
            <h1 className="text-xl font-bold text-gray-900 mt-2">입점 신청 상세 보기</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">처리 상태:</span>
            <InquiryStatusSelect
              status={status}
              onChange={handleStatusChange}
              disabled={isPending}
            />
          </div>
        </div>

        {/* 상세 정보 격자 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">신청사 및 대표 정보</h3>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Store className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-semibold w-24">사업명/상호:</span>
              <span className="font-semibold text-gray-950">{application.businessName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-semibold w-24">대표자/신청자:</span>
              <span>{application.applicantName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-semibold w-24">사업유형:</span>
              <span>{application.businessType || "미지정"}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">기타 접수 정보</h3>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-semibold w-24">연락처:</span>
              <span>{application.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-semibold w-24">이메일:</span>
              <span>{application.email || "-"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-semibold w-24">접수 일시:</span>
              <span>{new Date(application.createdAt).toLocaleString("ko-KR")}</span>
            </div>
          </div>
        </div>

        {/* 동의 사항 */}
        <div className="flex items-center gap-3 text-sm text-gray-700 py-3 px-4 bg-gray-50 rounded-xl border border-gray-100 w-fit">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-semibold">개인정보 수집 및 동의 여부:</span>
          <span className={`font-bold ${application.privacyConsent ? "text-emerald-600" : "text-red-500"}`}>
            {application.privacyConsent ? "동의함" : "동의 안 함"}
          </span>
        </div>

        {/* 제안 상세 본문 */}
        <div className="flex flex-col gap-3 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">제안 내용 및 메시지</h3>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
            {application.message || "상세 메시지가 작성되지 않았습니다."}
          </div>
        </div>
      </div>
    </div>
  );
}
