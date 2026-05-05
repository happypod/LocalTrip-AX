"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Region } from "@prisma/client";
import { createRegion, updateRegion } from "@/app/admin/regions/actions";

interface RegionFormProps {
  initialData?: Region | null;
}

export function RegionForm({ initialData }: RegionFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (initialData) {
        await updateRegion(initialData.id, formData);
      } else {
        await createRegion(formData);
      }
      router.push("/admin/regions");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "오류가 발생했습니다.");
      } else {
        setError("오류가 발생했습니다.");
      }
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6 max-w-2xl">
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl">
          {error}
        </div>
      )}

      {initialData && (
        <div className="p-4 text-sm text-amber-600 bg-amber-50 rounded-xl">
          <strong>주의:</strong> slug는 공개 화면과 데이터 조회 기준에 사용될 수 있습니다. 변경 시 연결된 화면에 영향을 줄 수 있습니다.
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-900">지역명 <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          required 
          defaultValue={initialData?.name}
          className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors"
          placeholder="예: 소원면"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="slug" className="text-sm font-medium text-gray-900">Slug (영문/숫자/하이픈) <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          id="slug" 
          name="slug" 
          required 
          defaultValue={initialData?.slug}
          pattern="^[a-z0-9-]+$"
          className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors"
          placeholder="예: sowon"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium text-gray-900">설명</label>
        <textarea 
          id="description" 
          name="description" 
          defaultValue={initialData?.description || ""}
          rows={3}
          className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors resize-none"
          placeholder="지역에 대한 짧은 설명을 입력하세요."
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="status" className="text-sm font-medium text-gray-900">상태 <span className="text-red-500">*</span></label>
        <select 
          id="status" 
          name="status" 
          defaultValue={initialData?.status || "draft"}
          className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors bg-white"
        >
          <option value="published">공개 (Published)</option>
          <option value="draft">임시저장 (Draft)</option>
          <option value="inactive">비활성 (Inactive)</option>
        </select>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <button 
          type="button" 
          onClick={() => router.push("/admin/regions")}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          취소
        </button>
        <button 
          type="submit" 
          disabled={isPending}
          className="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-lg transition-colors"
        >
          {isPending ? "저장 중..." : initialData ? "수정하기" : "저장하기"}
        </button>
      </div>
    </form>
  );
}
