"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Accommodation, BusinessProfile, Region } from "@prisma/client";
import { createStay, updateStay } from "@/app/admin/stays/actions";

interface StayFormProps {
  initialData?: Accommodation;
  regions: Region[];
  businesses: BusinessProfile[];
}

export function StayForm({ initialData, regions, businesses }: StayFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // images input state
  const [imagesInput, setImagesInput] = useState(initialData?.images?.join("\n") || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Validate slug
    const slug = formData.get("slug") as string;
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setError("슬러그는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.");
      setIsPending(false);
      return;
    }

    const data = {
      regionId: formData.get("regionId") as string,
      businessProfileId: formData.get("businessProfileId") as string,
      title: formData.get("title") as string,
      slug: slug,
      summary: formData.get("summary") as string,
      description: formData.get("description") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      kakaoUrl: formData.get("kakaoUrl") as string,
      naverBookingUrl: formData.get("naverBookingUrl") as string,
      websiteUrl: formData.get("websiteUrl") as string,
      priceText: formData.get("priceText") as string,
      capacityText: formData.get("capacityText") as string,
      status: formData.get("status") as string,
      images: imagesInput.split(/[\n,]+/).map(url => url.trim()).filter(Boolean),
    };

    try {
      if (initialData) {
        await updateStay(initialData.id, data);
      } else {
        await createStay(data);
      }
      router.push("/admin/stays");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "오류가 발생했습니다.");
      } else {
        setError("오류가 발생했습니다.");
      }
      setIsPending(false);
    }
  }

  // Sort businesses: try to put accommodation-related ones at the top
  const accommodationBusinesses = businesses.filter(b => 
    b.businessType?.includes("accommodation") || 
    b.businessType?.includes("숙소") || 
    b.businessType?.includes("숙박") || 
    b.businessType?.includes("펜션") || 
    b.businessType?.includes("민박")
  );
  const otherBusinesses = businesses.filter(b => !accommodationBusinesses.includes(b));
  const sortedBusinesses = [...accommodationBusinesses, ...otherBusinesses];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {/* Warning Banner */}
      <div className="p-4 text-sm text-blue-600 bg-blue-50 rounded-xl">
        <strong>안내:</strong> 현재 숙소 유형, 위/경도, 편의시설, 태그 등의 필드는 DB 스키마 제약으로 폼에서 제외되었습니다.
      </div>

      {businesses.length === 0 && (
        <div className="p-4 text-sm text-amber-600 bg-amber-50 rounded-xl">
          <strong>안내:</strong> 등록된 사업자 프로필이 없습니다. 먼저 사업자 관리에서 숙소 운영자를 등록해 주세요.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 기본 정보 */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold border-b pb-2">기본 정보</h2>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">지역 (Region) <span className="text-red-500">*</span></label>
            <select 
              name="regionId" 
              defaultValue={initialData?.regionId || ""}
              required 
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="" disabled>지역을 선택하세요</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>{region.name} ({region.slug})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">사업자/운영자 (Business Profile)</label>
            <select 
              name="businessProfileId" 
              defaultValue={initialData?.businessProfileId || ""}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">(선택 안함)</option>
              {sortedBusinesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} {b.businessType ? `[${b.businessType}]` : ""}
                </option>
              ))}
            </select>
            <span className="text-xs text-gray-500">가능한 선택을 유도합니다.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">숙소명 <span className="text-red-500">*</span></label>
            <input 
              name="title" 
              defaultValue={initialData?.title}
              required 
              placeholder="예: 파도소리 펜션"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">슬러그 (Slug) <span className="text-red-500">*</span></label>
            <input 
              name="slug" 
              defaultValue={initialData?.slug}
              required 
              placeholder="padosori-pension"
              pattern="[a-z0-9-]+"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <span className="text-xs text-gray-500">영문 소문자, 숫자, 하이픈만 사용 가능. URL로 사용됩니다. 수정 시 기존 링크에 영향을 줍니다.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">요약 (Summary) <span className="text-red-500">*</span></label>
            <input 
              name="summary" 
              defaultValue={initialData?.summary}
              required 
              placeholder="파도가 한눈에 보이는 조용한 펜션"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">상세 설명</label>
            <textarea 
              name="description" 
              defaultValue={initialData?.description || ""}
              rows={4}
              placeholder="숙소에 대한 상세한 설명을 적어주세요."
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>
        </section>

        <div className="flex flex-col gap-6">
          {/* 노출 설정 */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">노출 설정</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">상태 (Status) <span className="text-red-500">*</span></label>
              <select 
                name="status" 
                defaultValue={initialData?.status || "draft"}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              >
                <option value="published">Published (공개 화면 노출)</option>
                <option value="draft">Draft (관리자 작성 중)</option>
                <option value="inactive">Inactive (비활성/비공개)</option>
              </select>
              <span className="text-xs text-gray-500">공개 화면에는 Published 상태인 숙소만 노출됩니다.</span>
            </div>
          </section>

          {/* 가격/수용 인원 */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">가격/수용 인원 안내</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">가격 안내 문구 (Price Text)</label>
              <input 
                name="priceText" 
                defaultValue={initialData?.priceText || ""}
                placeholder="예: 1박 80,000원 ~ 150,000원"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">인원 안내 문구 (Capacity Text)</label>
              <input 
                name="capacityText" 
                defaultValue={initialData?.capacityText || ""}
                placeholder="예: 기준 2인 / 최대 4인"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </section>

          {/* 위치/연락처/외부 링크 */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">위치/외부 문의 링크 (CTA)</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">주소</label>
              <input 
                name="address" 
                defaultValue={initialData?.address || ""}
                placeholder="상세 주소를 입력하세요"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">전화번호</label>
              <input 
                name="phone" 
                defaultValue={initialData?.phone || ""}
                placeholder="010-0000-0000"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">카카오톡 문의 URL</label>
              <input 
                name="kakaoUrl" 
                defaultValue={initialData?.kakaoUrl || ""}
                placeholder="https://open.kakao.com/o/..."
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">네이버 예약 URL</label>
              <input 
                name="naverBookingUrl" 
                defaultValue={initialData?.naverBookingUrl || ""}
                placeholder="https://booking.naver.com/..."
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">홈페이지 URL</label>
              <input 
                name="websiteUrl" 
                defaultValue={initialData?.websiteUrl || ""}
                placeholder="https://..."
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </section>

          {/* 이미지 (다중) */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">이미지 URL 목록</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">이미지 URL</label>
              <textarea 
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                rows={4}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
              <span className="text-xs text-gray-500">쉼표(,) 또는 줄바꿈으로 구분하여 여러 개를 입력할 수 있습니다. 첫 번째 이미지가 대표 이미지로 사용됩니다. 이미지가 없으면 fallback UI가 노출됩니다.</span>
            </div>
          </section>

        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.push("/admin/stays")}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "저장 중..." : (initialData ? "수정하기" : "저장하기")}
        </button>
      </div>
    </form>
  );
}
