"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BusinessProfile, Region } from "@prisma/client";
import { createBusiness, updateBusiness } from "@/app/admin/businesses/actions";

const BUSINESS_TYPE_OPTIONS = [
  { value: "accommodation", label: "숙소 운영자" },
  { value: "experience_host", label: "체험 호스트" },
  { value: "local_creator", label: "주민소득상품 운영자" },
  { value: "fnb", label: "식음료" },
  { value: "retail", label: "로컬 상점" },
];

interface BusinessFormProps {
  initialData?: BusinessProfile | null;
  regions: Region[];
}

export function BusinessForm({ initialData, regions }: BusinessFormProps) {
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
        await updateBusiness(initialData.id, formData);
      } else {
        await createBusiness(formData);
      }
      router.push("/admin/businesses");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.");
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

      <div className="p-4 text-sm text-blue-600 bg-blue-50 rounded-xl">
        <strong>운영 분류:</strong> 사업자 유형은 관리자 목록과 추후 상품 연결 기준으로 저장됩니다.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="regionId" className="text-sm font-medium text-gray-900">지역 <span className="text-red-500">*</span></label>
          <select
            id="regionId"
            name="regionId"
            required
            defaultValue={initialData?.regionId || ""}
            className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors bg-white"
          >
            <option value="" disabled>지역을 선택하세요</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="businessType" className="text-sm font-medium text-gray-900">사업자 유형 <span className="text-red-500">*</span></label>
          <select
            id="businessType"
            name="businessType"
            required
            defaultValue={initialData?.businessType || ""}
            className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors bg-white"
          >
            <option value="" disabled>유형을 선택하세요</option>
            {BUSINESS_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-900">사업자/업체명 <span className="text-red-500">*</span></label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={initialData?.name}
          className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors"
          placeholder="예: 소원스테이"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="ownerName" className="text-sm font-medium text-gray-900">대표자명</label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            defaultValue={initialData?.ownerName || ""}
            className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors"
            placeholder="예: 소원 운영자 01"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium text-gray-900">연락처</label>
          <input
            type="text"
            id="phone"
            name="phone"
            defaultValue={initialData?.phone || ""}
            className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors"
            placeholder="010-0000-0000"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="address" className="text-sm font-medium text-gray-900">주소</label>
        <input
          type="text"
          id="address"
          name="address"
          defaultValue={initialData?.address || ""}
          className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors"
          placeholder="도로명 또는 지번 주소"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-900">연결 링크</label>
        <div className="flex flex-col gap-3">
          <input
            type="url"
            id="kakaoUrl"
            name="kakaoUrl"
            defaultValue={initialData?.kakaoUrl || ""}
            className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors"
            placeholder="카카오톡 채널 URL"
          />
          <input
            type="url"
            id="naverBookingUrl"
            name="naverBookingUrl"
            defaultValue={initialData?.naverBookingUrl || ""}
            className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors"
            placeholder="네이버예약 URL"
          />
          <input
            type="url"
            id="websiteUrl"
            name="websiteUrl"
            defaultValue={initialData?.websiteUrl || ""}
            className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors"
            placeholder="공식 웹페이지 URL"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium text-gray-900">소개</label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialData?.description || ""}
          rows={3}
          className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors resize-none"
          placeholder="사업자에 대한 간단한 소개를 입력하세요"
        />
      </div>

      <section className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-bold text-gray-900">지도 표시 정보</h2>
          <p className="text-xs text-gray-500">
            좌표가 입력된 운영자만 공개 지도에서 마커로 표시됩니다. 좌표가 없어도 사업자 관리에는 영향이 없습니다.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="mapAddress" className="text-sm font-medium text-gray-900">지도용 주소</label>
          <input
            type="text"
            id="mapAddress"
            name="mapAddress"
            defaultValue={initialData?.mapAddress || ""}
            className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors bg-white"
            placeholder="지도 API 검색용 주소"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="latitude" className="text-sm font-medium text-gray-900">위도</label>
            <input
              type="number"
              step="any"
              id="latitude"
              name="latitude"
              defaultValue={initialData?.latitude || ""}
              className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors bg-white"
              placeholder="36.7876"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="longitude" className="text-sm font-medium text-gray-900">경도</label>
            <input
              type="number"
              step="any"
              id="longitude"
              name="longitude"
              defaultValue={initialData?.longitude || ""}
              className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors bg-white"
              placeholder="126.1360"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="mapPlaceId" className="text-sm font-medium text-gray-900">외부 장소 ID</label>
            <input
              type="text"
              id="mapPlaceId"
              name="mapPlaceId"
              defaultValue={initialData?.mapPlaceId || ""}
              className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors bg-white"
              placeholder="Naver/Kakao/Google Place ID"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="mapProvider" className="text-sm font-medium text-gray-900">지도 제공자</label>
            <select
              id="mapProvider"
              name="mapProvider"
              defaultValue={initialData?.mapProvider || ""}
              className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors bg-white"
            >
              <option value="">선택 안함</option>
              <option value="manual">직접 입력</option>
              <option value="naver">네이버 지도</option>
              <option value="kakao">카카오맵</option>
              <option value="google">구글 지도</option>
            </select>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-2">
        <label htmlFor="status" className="text-sm font-medium text-gray-900">상태 <span className="text-red-500">*</span></label>
        <select
          id="status"
          name="status"
          defaultValue={initialData?.status || "draft"}
          className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary transition-colors bg-white max-w-[200px]"
        >
          <option value="published">공개</option>
          <option value="draft">임시저장</option>
          <option value="inactive">비활성</option>
        </select>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.push("/admin/businesses")}
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
