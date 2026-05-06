"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Region, PublishStatus } from "@prisma/client";
import { createTrainingCourse, updateTrainingCourse } from "@/app/admin/training/actions";

interface TrainingCourseFormProps {
  initialData?: {
    id: string;
    regionId: string;
    title: string;
    summary?: string;
    status: string;
  };
  regions: Region[];
}

export function TrainingCourseForm({ initialData, regions }: TrainingCourseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [regionId, setRegionId] = useState(initialData?.regionId ?? regions[0]?.id ?? "");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [summary, setSummary] = useState(initialData?.summary ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "draft");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!title.trim()) throw new Error("제목을 입력해주세요.");
      if (!regionId) throw new Error("권역을 선택해주세요.");

      const payload = {
        regionId,
        title,
        summary: summary || undefined,
        status,
      };

      if (initialData?.id) {
        await updateTrainingCourse(initialData.id, payload);
      } else {
        await createTrainingCourse(payload);
      }

      router.push("/admin/training");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "오류가 발생했습니다.");
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col gap-6 max-w-xl">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">대상 권역</label>
        <select
          value={regionId}
          onChange={(e) => setRegionId(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white"
          required
        >
          <option value="" disabled>권역을 선택하세요</option>
          {regions.map((reg) => (
            <option key={reg.id} value={reg.id}>{reg.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">교육과정명</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 주민 가이드 역량 강화 교육과정"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">교육 과정 요약 (선택)</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="교육과정에 대한 간략한 핵심 정보를 입력하세요."
          rows={3}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">공개 상태</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as PublishStatus)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white"
        >
          <option value="draft">Draft (임시 저장)</option>
          <option value="published">Published (공개)</option>
          <option value="inactive">Inactive (비공개/종료)</option>
        </select>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
        <button
          type="button"
          onClick={() => router.push("/admin/training")}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          취소
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "저장 중..." : initialData ? "과정 수정 완료" : "과정 등록 완료"}
        </button>
      </div>
    </form>
  );
}
