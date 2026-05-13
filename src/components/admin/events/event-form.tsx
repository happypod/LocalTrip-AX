"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Event, PublishStatus } from "@prisma/client";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { createEvent, updateEvent } from "@/app/admin/events/actions";

interface EventFormProps {
  initialEvent?: Event | null;
}

const GRADIENT_PRESETS = [
  { label: "Blue / Indigo", value: "from-blue-50 to-indigo-100/40" },
  { label: "Rose / Pink", value: "from-rose-50 to-pink-100/40" },
  { label: "Amber / Yellow", value: "from-amber-50 to-yellow-100/40" },
  { label: "Teal / Emerald", value: "from-teal-50 to-emerald-100/40" },
  { label: "Slate", value: "from-gray-50 to-slate-100/40" },
];

export function EventForm({ initialEvent }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tag, setTag] = useState(initialEvent?.tag || "");
  const [title, setTitle] = useState(initialEvent?.title || "");
  const [subTitle, setSubTitle] = useState(initialEvent?.subTitle || "");
  const [description, setDescription] = useState(
    initialEvent?.description || ""
  );
  const [gradient, setGradient] = useState(
    initialEvent?.gradient || "from-blue-50 to-indigo-100/40"
  );
  const [href, setHref] = useState(initialEvent?.href || "/stays");
  const [status, setStatus] = useState<PublishStatus>(
    initialEvent?.status || PublishStatus.draft
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        tag,
        title,
        subTitle,
        description,
        gradient,
        href,
        status,
      };

      if (initialEvent) {
        await updateEvent(initialEvent.id, payload);
      } else {
        await createEvent(payload);
      }

      router.push("/admin/events");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8 py-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/events"
          className="inline-flex items-center text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          목록으로 돌아가기
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {initialEvent ? "이벤트 수정 완료" : "이벤트 신규 등록"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <div className="border-b pb-3">
          <h2 className="text-lg font-black text-gray-900">이벤트 상세 정보</h2>
          <p className="mt-1 text-sm text-gray-500">
            이벤트는 기본 소원권역(`sowon`)에 연결되며, 공개 화면에는 Published 상태만 노출됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <TextField
            label="이벤트 배지 태그 *"
            value={tag}
            onChange={setTag}
            placeholder="예: 소원권역 주말 기획"
            required
          />

          <TextField
            label="이벤트 제목 *"
            value={title}
            onChange={setTitle}
            placeholder="예: 바다마을 체험 주간"
            required
          />

          <TextField
            label="서브 제목 *"
            value={subTitle}
            onChange={setSubTitle}
            placeholder="예: 주민이 준비한 체험과 별미"
            required
          />

          <TextField
            label="클릭 이동 경로 *"
            value={href}
            onChange={setHref}
            placeholder="/stays, /experiences, /programs, /courses"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-gray-600">
              배경 그라디언트 *
            </label>
            <select
              value={gradient}
              onChange={(event) => setGradient(event.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {GRADIENT_PRESETS.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-gray-600">
              공개 상태 *
            </label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as PublishStatus)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value={PublishStatus.draft}>Draft</option>
              <option value={PublishStatus.published}>Published</option>
              <option value={PublishStatus.inactive}>Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-gray-600">
            이벤트 설명 *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="이벤트 설명을 입력하세요."
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
    </form>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-black uppercase tracking-wider text-gray-600">
        {label}
      </label>
      <input
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
