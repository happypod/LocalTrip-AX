"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BusinessProfile, LocalIncomeProgram, Region } from "@prisma/client";
import { createProgram, updateProgram } from "@/app/admin/programs/actions";

interface ProgramFormProps {
  initialData?: LocalIncomeProgram;
  regions: Region[];
  businesses: BusinessProfile[];
}

export function ProgramForm({ initialData, regions, businesses }: ProgramFormProps) {
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
      linkedLifeService: formData.get("linkedLifeService") as string,
      residentRole: formData.get("residentRole") as string,
      revenueUse: formData.get("revenueUse") as string,
      category: formData.get("category") as string,
      location: formData.get("location") as string,
      durationText: formData.get("durationText") as string,
      capacityText: formData.get("capacityText") as string,
      phone: formData.get("phone") as string,
      kakaoUrl: formData.get("kakaoUrl") as string,
      naverBookingUrl: formData.get("naverBookingUrl") as string,
      websiteUrl: formData.get("websiteUrl") as string,
      priceText: formData.get("priceText") as string,
      status: formData.get("status") as string,
      images: imagesInput.split(/[\n,]+/).map(url => url.trim()).filter(Boolean),
      latitude: formData.get("latitude") as string,
      longitude: formData.get("longitude") as string,
      mapAddress: formData.get("mapAddress") as string,
      mapPlaceId: formData.get("mapPlaceId") as string,
      mapProvider: formData.get("mapProvider") as string,
    };

    try {
      if (initialData) {
        await updateProgram(initialData.id, data);
      } else {
        await createProgram(data);
      }
      router.push("/admin/programs");
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {businesses.length === 0 && (
        <div className="p-4 text-sm text-amber-600 bg-amber-50 rounded-xl">
          <strong>안내:</strong> 등록된 사업자 프로필이 없습니다. 먼저 사업자 관리에서 운영자를 등록해 주세요.
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
            <label className="text-sm font-semibold text-gray-700">운영자 (Business Profile)</label>
            <select
              name="businessProfileId"
              defaultValue={initialData?.businessProfileId || ""}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">(선택 안함)</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} {b.businessType ? `[${b.businessType}]` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">상품명 <span className="text-red-500">*</span></label>
            <input
              name="title"
              defaultValue={initialData?.title}
              required
              placeholder="예: 천리포 해변 청소 워크숍"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">슬러그 (Slug) <span className="text-red-500">*</span></label>
            <input
              name="slug"
              defaultValue={initialData?.slug}
              required
              placeholder="cheonripo-beach-clean"
              pattern="[a-z0-9-]+"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <span className="text-xs text-gray-500">영문 소문자, 숫자, 하이픈만 허용됩니다.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">요약 (Summary) <span className="text-red-500">*</span></label>
            <input
              name="summary"
              defaultValue={initialData?.summary}
              required
              placeholder="마을 주민과 함께하는 해변 정화 활동"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">카테고리</label>
            <input
              name="category"
              defaultValue={initialData?.category || ""}
              placeholder="예: 식생활, 가족체류, 주민일자리, 생활인구"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">상세 설명</label>
            <textarea
              name="description"
              defaultValue={initialData?.description || ""}
              rows={4}
              placeholder="주민소득상품에 대한 상세 설명을 작성하세요."
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>
        </section>

        <div className="flex flex-col gap-6">
          {/* 주민소득상품 핵심 구조 */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2 text-primary">주민소득상품 핵심 구조</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">생활서비스 연계 <span className="text-red-500">*</span></label>
              <input
                name="linkedLifeService"
                defaultValue={initialData?.linkedLifeService}
                required
                placeholder="예: 해양 환경 정화 및 재활용 교육"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">주민 역할 <span className="text-red-500">*</span></label>
              <input
                name="residentRole"
                defaultValue={initialData?.residentRole}
                required
                placeholder="예: 어르신들이 업사이클링 재료 준비 및 시연"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">수익 활용 <span className="text-red-500">*</span></label>
              <input
                name="revenueUse"
                defaultValue={initialData?.revenueUse}
                required
                placeholder="예: 마을 기금 조성 및 어르신 복지 시설 개선"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </section>

          {/* 노출 설정 */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">노출 상태</h2>
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
            </div>
          </section>

          {/* 운영/문의 정보 */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">운영/문의 정보</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">장소/위치 (Location)</label>
              <input
                name="location"
                defaultValue={initialData?.location || ""}
                placeholder="예: 천리포 마을회관 앞"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">가격 안내 (Price Text)</label>
              <input
                name="priceText"
                defaultValue={initialData?.priceText || ""}
                placeholder="예: 1인 20,000원 (수익금 50% 마을 기부)"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">소요 시간</label>
              <input
                name="durationText"
                defaultValue={initialData?.durationText || ""}
                placeholder="예: 1시간 30분"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">인원 안내</label>
              <input
                name="capacityText"
                defaultValue={initialData?.capacityText || ""}
                placeholder="예: 최소 2인 / 최대 10인"
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

          {/* 이미지 */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">이미지 (다중)</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">이미지 URL 목록</label>
              <textarea
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                rows={4}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
              <span className="text-xs text-gray-500">쉼표(,) 또는 줄바꿈으로 구분하여 여러 개를 입력할 수 있습니다.</span>
            </div>
          </section>

          {/* 지도 표시 정보 */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">지도 표시 정보</h2>
            <div className="p-4 text-sm text-blue-600 bg-blue-50 rounded-xl">
              <strong>안내:</strong> 좌표가 입력된 콘텐츠만 공개 지도에서 marker로 표시됩니다. 좌표가 비어 있어도 목록과 상세 화면은 정상 노출됩니다.
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">지도용 주소</label>
              <input
                name="mapAddress"
                defaultValue={initialData?.mapAddress || ""}
                placeholder="지도 API 검색용 주소"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">위도 (Latitude)</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  defaultValue={initialData?.latitude || ""}
                  placeholder="예: 36.7876"
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">경도 (Longitude)</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  defaultValue={initialData?.longitude || ""}
                  placeholder="예: 126.1360"
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">외부 장소 ID (Place ID)</label>
              <input
                name="mapPlaceId"
                defaultValue={initialData?.mapPlaceId || ""}
                placeholder="외부 장소 고유 식별자"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">지도 제공자</label>
              <select
                name="mapProvider"
                defaultValue={initialData?.mapProvider || ""}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">(선택 안함)</option>
                <option value="manual">직접 입력 (manual)</option>
                <option value="naver">네이버 지도 (naver)</option>
                <option value="kakao">카카오맵 (kakao)</option>
                <option value="google">구글 지도 (google)</option>
              </select>
            </div>
          </section>

        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.push("/admin/programs")}
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
