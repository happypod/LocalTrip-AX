"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Event, PublishStatus } from "@prisma/client";
import { createEvent, updateEvent } from "@/app/admin/events/actions";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface EventFormProps {
  initialEvent?: Event | null;
}

const GRADIENT_PRESETS = [
  { label: "Blue / Indigo (기본 블루)", value: "from-blue-50 to-indigo-100/40" },
  { label: "Rose / Pink (러블리 핑크)", value: "from-rose-50 to-pink-100/40" },
  { label: "Amber / Yellow (골든 에로우)", value: "from-amber-50 to-yellow-100/40" },
  { label: "Teal / Emerald (에메랄드 포레스트)", value: "from-teal-50 to-emerald-100/40" },
];

export function EventForm({ initialEvent }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tag, setTag] = useState(initialEvent?.tag || "");
  const [title, setTitle] = useState(initialEvent?.title || "");
  const [subTitle, setSubTitle] = useState(initialEvent?.subTitle || "");
  const [description, setDescription] = useState(initialEvent?.description || "");
  const [gradient, setGradient] = useState(initialEvent?.gradient || "from-blue-50 to-indigo-100/40");
  const [href, setHref] = useState(initialEvent?.href || "/stays");
  const [status, setStatus] = useState<PublishStatus>(initialEvent?.status || "draft");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (initialEvent) {
        await updateEvent(initialEvent.id, {
          tag,
          title,
          subTitle,
          description,
          gradient,
          href,
          status,
        });
      } else {
        await createEvent({
          tag,
          title,
          subTitle,
          description,
          gradient,
          href,
          status,
        });
      }
      router.push("/admin/events");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "오류가 발생했습니다.");
      } else {
        setError("오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/events"
          className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          목록으로 돌아가기
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 shadow-sm"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {initialEvent ? "이벤트 수정 완료" : "이벤트 신규 등록"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Main Form Fields Panel */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6 shadow-sm">
        <h2 className="text-lg font-black text-gray-900 border-b pb-3">이벤트 상세 정보</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tag */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-gray-600 uppercase tracking-wider">이벤트 배지 태그 *</label>
            <input 
              required
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="예: 매주 화·수·금 오전 10시 오픈!, 소원트립 단독 혜택!"
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-gray-600 uppercase tracking-wider">이벤트 핵심 타이틀 *</label>
            <input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 놀라운 소원 특가 등장, 더블쿠폰 핫세일"
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
            />
          </div>

          {/* SubTitle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-gray-600 uppercase tracking-wider">이벤트 서브 헤더 *</label>
            <input 
              required
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="예: 주중 힐링 스테이 오픈런, 전체 체험 최대 50% 할인"
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Href Link */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-gray-600 uppercase tracking-wider">클릭 시 이동 경로 *</label>
            <input 
              required
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="예: /stays, /experiences, /programs, /courses"
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Gradient */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-gray-600 uppercase tracking-wider">배경 그라데이션 스타일 *</label>
            <select
              value={gradient}
              onChange={(e) => setGradient(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
            >
              {GRADIENT_PRESETS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-gray-600 uppercase tracking-wider">전시 및 활성 상태 *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PublishStatus)}
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
            >
              <option value="draft">Draft (임시 저장)</option>
              <option value="published">Published (메인 노출)</option>
              <option value="inactive">Inactive (비활성화)</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black text-gray-600 uppercase tracking-wider">이벤트 세부 설명 *</label>
          <textarea 
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="예: 인기 숙소 초특가 선착순 한정수량 할인 혜택에 관한 추가 가이드를 적어주세요."
            className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400"
          />
        </div>
      </div>
    </form>
  );
}
