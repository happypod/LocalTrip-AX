"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BusinessProfile, Experience, Region } from "@prisma/client";
import { createExperience, updateExperience } from "@/app/admin/experiences/actions";

interface ExperienceFormProps {
  initialData?: Experience;
  regions: Region[];
  businesses: BusinessProfile[];
}

export function ExperienceForm({ initialData, regions, businesses }: ExperienceFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imagesInput, setImagesInput] = useState(initialData?.images?.join("\n") || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
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
      location: formData.get("location") as string,
      phone: formData.get("phone") as string,
      kakaoUrl: formData.get("kakaoUrl") as string,
      naverBookingUrl: formData.get("naverBookingUrl") as string,
      websiteUrl: formData.get("websiteUrl") as string,
      priceText: formData.get("priceText") as string,
      capacityText: formData.get("capacityText") as string,
      durationText: formData.get("durationText") as string,
      status: formData.get("status") as string,
      images: imagesInput.split(/[\n,]+/).map(url => url.trim()).filter(Boolean),
    };

    try {
      if (initialData) {
        await updateExperience(initialData.id, data);
      } else {
        await createExperience(data);
      }
      router.push("/admin/experiences");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "오류가 발생했습니다.");
      } else {
        setError("오류가 발생했습니다.");
      }
      setIsPending(false);
    }
  }

  const experienceBusinesses = businesses.filter(b => 
    b.businessType?.includes("experience") || 
    b.businessType?.includes("체험") || 
    b.businessType?.includes("가이드") || 
    b.businessType?.includes("공방")
  );
  const otherBusinesses = businesses.filter(b => !experienceBusinesses.includes(b));
  const sortedBusinesses = [...experienceBusinesses, ...otherBusinesses];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {/* Warning Banner */}
      <div className="p-4 text-sm text-blue-600 bg-blue-50 rounded-xl">
        <strong>안내:</strong> 현재 체험 카테고리, 안전안내, 위/경도, 준비물, 태그 등의 필드는 DB 스키마 제약으로 폼에서 제외되었습니다. <strong>상세 설명</strong>에 포함하여 작성해 주세요. <br />
        <span className="text-blue-500 font-semibold text-xs mt-1 block">주민소득과 생활서비스 환류 구조를 명확히 관리해야 하는 상품은 &apos;주민소득상품 관리&apos;에서 등록하는 것을 권장합니다.</span>
      </div>

      {businesses.length === 0 && (
        <div className="p-4 text-sm text-amber-600 bg-amber-50 rounded-xl">
          <strong>안내:</strong> 등록된 사업자 프로필이 없습니다. 먼저 사업자 관리에서 체험 운영자를 등록해 주세요.
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
            <label className="text-sm font-semibold text-gray-700">체험 운영자 (Business Profile)</label>
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
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">체험명 <span className="text-red-500">*</span></label>
            <input 
              name="title" 
              defaultValue={initialData?.title}
              required 
              placeholder="예: 만리포 노을길 산책"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">슬러그 (Slug) <span className="text-red-500">*</span></label>
            <input 
              name="slug" 
              defaultValue={initialData?.slug}
              required 
              placeholder="mallipo-sunset-walk"
              pattern="[a-z0-9-]+"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <span className="text-xs text-gray-500">공개 체험 상세 URL에 사용됩니다. 변경 시 기존 링크에 영향을 줄 수 있습니다. (영문 소문자, 숫자, 하이픈만 허용)</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">요약 (Summary) <span className="text-red-500">*</span></label>
            <input 
              name="summary" 
              defaultValue={initialData?.summary}
              required 
              placeholder="해 질 녘 만리포 해변을 따라 걷는 낭만적인 산책"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">상세 설명 / 안전 안내</label>
            <textarea 
              name="description" 
              defaultValue={initialData?.description || ""}
              rows={6}
              placeholder="체험에 대한 상세한 설명, 안전 안내, 준비물 등을 적어주세요.&#10;예: 기상 상황에 따라 운영이 변경될 수 있습니다. 어린이는 보호자 동반이 필요합니다."
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
            <span className="text-xs text-amber-600 font-medium">체험상품은 참여자 안전과 운영 조건이 중요합니다. 안전안내, 준비물, 기상·물때 등 제한사항이 있다면 반드시 입력해 주세요.</span>
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
              <span className="text-xs text-gray-500">공개 화면에는 Published 상태인 체험만 노출됩니다.</span>
            </div>
          </section>

          {/* 가격/인원/소요시간 */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">운영 정보</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">소요 시간 (Duration Text)</label>
              <input 
                name="durationText" 
                defaultValue={initialData?.durationText || ""}
                placeholder="예: 1시간 30분"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">가격 안내 (Price Text)</label>
              <input 
                name="priceText" 
                defaultValue={initialData?.priceText || ""}
                placeholder="예: 성인 15,000원 / 아동 10,000원"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">인원 안내 (Capacity Text)</label>
              <input 
                name="capacityText" 
                defaultValue={initialData?.capacityText || ""}
                placeholder="예: 최소 2인 / 최대 10인"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </section>

          {/* 위치/연락처/외부 링크 */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">위치/외부 문의 링크 (CTA)</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">만남 장소/위치 (Location)</label>
              <input 
                name="location" 
                defaultValue={initialData?.location || ""}
                placeholder="예: 만리포 해수욕장 관광안내소 앞"
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
          onClick={() => router.push("/admin/experiences")}
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
