"use client";

import { useState } from "react";
import Link from "next/link";
import { Inquiry, Region, InquiryStatus } from "@prisma/client";
import { InquiryStatusSelect } from "@/components/admin/inquiry-status-select";
import { updateInquiryStatus } from "@/app/admin/inquiries/actions";
import { ArrowLeft, Calendar, Mail, Phone, User, CheckCircle, Tag } from "lucide-react";

type InquiryWithRelations = Inquiry & {
  region: Region;
};

interface InquiryDetailProps {
  inquiry: InquiryWithRelations;
}

export function InquiryDetail({ inquiry }: InquiryDetailProps) {
  const [status, setStatus] = useState(inquiry.status);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: InquiryStatus) => {
    setIsPending(true);
    setError(null);
    setSuccess(null);

    try {
      await updateInquiryStatus(inquiry.id, newStatus);
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

  const formatTargetType = (type: string | null) => {
    if (!type) return "일반";
    switch (type) {
      case "accommodation":
        return "숙소";
      case "experience":
        return "체험";
      case "local_income_program":
        return "주민소득상품";
      case "course":
        return "코스";
      case "general":
        return "일반";
      default:
        return type;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* 뒤로가기 링크 */}
      <div>
        <Link
          href="/admin/inquiries"
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
              {inquiry.region.name} 권역
            </span>
            <h1 className="text-xl font-bold text-gray-900 mt-2">일반 문의 상세 보기</h1>
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
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">기본 정보</h3>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-semibold w-24">이름:</span>
              <span>{inquiry.name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-semibold w-24">연락처:</span>
              <span>{inquiry.phone || "-"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-semibold w-24">이메일:</span>
              <span>{inquiry.email || "-"}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">접수 정보</h3>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-semibold w-24">접수 일시:</span>
              <span>{new Date(inquiry.createdAt).toLocaleString("ko-KR")}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Tag className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-semibold w-24">문의 대상:</span>
              <span className="font-semibold text-primary">
                {formatTargetType(inquiry.targetType)} {inquiry.targetId ? `(ID: ${inquiry.targetId})` : ""}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-semibold w-24">개인정보동의:</span>
              <span className={`font-semibold ${inquiry.privacyConsent ? "text-emerald-600" : "text-red-500"}`}>
                {inquiry.privacyConsent ? "동의함" : "동의 안 함"}
              </span>
            </div>
          </div>
        </div>

        {/* 메시지 전체 본문 */}
        <div className="flex flex-col gap-3 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">문의 내용</h3>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
            {inquiry.message}
          </div>
        </div>
      </div>
    </div>
  );
}
