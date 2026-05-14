"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Accommodation, BusinessProfile, Region } from "@prisma/client";
import { createStay, updateStay } from "@/app/admin/stays/actions";
import { normalizePremiumPr } from "@/lib/premium-pr";

interface StayFormProps {
  initialData?: Accommodation;
  regions: Region[];
  businesses: BusinessProfile[];
}

export function StayForm({ initialData, regions, businesses }: StayFormProps) {
  const router = useRouter();
  const initialPremiumPr = normalizePremiumPr(initialData?.premiumPr);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagesInput, setImagesInput] = useState(initialData?.images?.join("\n") || "");
  const [isPremiumPrEnabled, setIsPremiumPrEnabled] = useState(
    initialPremiumPr.isPremium
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const slug = String(formData.get("slug") || "").trim().toLowerCase();

    if (!/^[a-z0-9-]+$/.test(slug)) {
      setError("슬러그는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
      setIsPending(false);
      return;
    }

    const data = {
      regionId: formData.get("regionId") as string,
      businessProfileId: formData.get("businessProfileId") as string,
      title: formData.get("title") as string,
      slug,
      summary: formData.get("summary") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      kakaoUrl: formData.get("kakaoUrl") as string,
      naverBookingUrl: formData.get("naverBookingUrl") as string,
      websiteUrl: formData.get("websiteUrl") as string,
      priceText: formData.get("priceText") as string,
      capacityText: formData.get("capacityText") as string,
      status: formData.get("status") as string,
      images: imagesInput.split(/[\n,]+/).map((url) => url.trim()).filter(Boolean),
      latitude: formData.get("latitude") as string,
      longitude: formData.get("longitude") as string,
      mapAddress: formData.get("mapAddress") as string,
      mapPlaceId: formData.get("mapPlaceId") as string,
      mapProvider: formData.get("mapProvider") as string,
      premiumPr: {
        isPremium: formData.get("premiumPrIsPremium") === "on",
        matterportUrl: formData.get("premiumPrMatterportUrl") as string,
        hostVideoUrl: formData.get("premiumPrHostVideoUrl") as string,
        droneViewUrl: formData.get("premiumPrDroneViewUrl") as string,
        badgeLabel: formData.get("premiumPrBadgeLabel") as string,
        packageName: formData.get("premiumPrPackageName") as string,
        expiresAt: formData.get("premiumPrExpiresAt") as string,
      },
    };

    try {
      if (initialData) {
        await updateStay(initialData.id, data);
      } else {
        await createStay(data);
      }

      router.push("/admin/stays");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      setIsPending(false);
    }
  }

  const accommodationBusinesses = businesses.filter((business) =>
    business.businessType?.includes("accommodation") ||
    business.businessType?.includes("숙소") ||
    business.businessType?.includes("숙박") ||
    business.businessType?.includes("펜션") ||
    business.businessType?.includes("민박"),
  );
  const otherBusinesses = businesses.filter((business) => !accommodationBusinesses.includes(business));
  const sortedBusinesses = [...accommodationBusinesses, ...otherBusinesses];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {businesses.length === 0 && (
        <div className="p-4 text-sm text-amber-600 bg-amber-50 rounded-xl">
          <strong>안내:</strong> 등록된 사업자 프로필이 없습니다. 먼저 사업자 관리에서 숙소 운영자를 등록해 주세요.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold border-b pb-2">기본 정보</h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">지역 <span className="text-red-500">*</span></label>
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
            <label className="text-sm font-semibold text-gray-700">사업자/운영자</label>
            <select
              name="businessProfileId"
              defaultValue={initialData?.businessProfileId || ""}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">선택 안함</option>
              {sortedBusinesses.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.name} {business.businessType ? `[${business.businessType}]` : ""}
                </option>
              ))}
            </select>
            <span className="text-xs text-gray-500">사업자 연결은 선택 사항입니다.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">숙소명 <span className="text-red-500">*</span></label>
            <input
              name="title"
              defaultValue={initialData?.title}
              required
              placeholder="예: 천리포 어촌 민박"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">슬러그 <span className="text-red-500">*</span></label>
            <input
              name="slug"
              defaultValue={initialData?.slug}
              required
              placeholder="padori-minbak"
              pattern="[a-z0-9-]+"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <span className="text-xs text-gray-500">영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">요약 <span className="text-red-500">*</span></label>
            <input
              name="summary"
              defaultValue={initialData?.summary}
              required
              placeholder="바다가 보이는 조용한 숙소"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">카테고리</label>
            <input
              name="category"
              defaultValue={initialData?.category || ""}
              placeholder="예: 한옥, 글램핑, 민박, 펜션"
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <span className="text-xs text-gray-500">비워두면 숙소명 타이틀에서 키워드를 통해 자동으로 카테고리를 유추하여 필터에 노출합니다.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">상세 설명</label>
            <textarea
              name="description"
              defaultValue={initialData?.description || ""}
              rows={4}
              placeholder="숙소에 대한 상세 설명을 입력하세요."
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">노출 설정</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">상태 <span className="text-red-500">*</span></label>
              <select
                name="status"
                defaultValue={initialData?.status || "draft"}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              >
                <option value="published">Published (공개)</option>
                <option value="draft">Draft (작성 중)</option>
                <option value="inactive">Inactive (비공개)</option>
              </select>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">가격 및 인원</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">가격 안내</label>
              <input
                name="priceText"
                defaultValue={initialData?.priceText || ""}
                placeholder="예: 1박 80,000원부터"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">인원 안내</label>
              <input
                name="capacityText"
                defaultValue={initialData?.capacityText || ""}
                placeholder="예: 기준 2명 / 최대 4명"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">위치 및 문의 링크</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">주소</label>
              <input
                name="address"
                defaultValue={initialData?.address || ""}
                placeholder="상세 주소"
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
              <label className="text-sm font-semibold text-gray-700">카카오 문의 URL</label>
              <input
                name="kakaoUrl"
                defaultValue={initialData?.kakaoUrl || ""}
                placeholder="https://open.kakao.com/o/..."
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">네이버예약 URL</label>
              <input
                name="naverBookingUrl"
                defaultValue={initialData?.naverBookingUrl || ""}
                placeholder="https://booking.naver.com/..."
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">웹페이지 URL</label>
              <input
                name="websiteUrl"
                defaultValue={initialData?.websiteUrl || ""}
                placeholder="https://..."
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">이미지 URL 목록</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">이미지 URL</label>
              <textarea
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                rows={4}
                placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
              <span className="text-xs text-gray-500">쉼표 또는 줄바꿈으로 여러 개를 입력할 수 있습니다. 첫 번째 이미지가 대표 이미지로 사용됩니다.</span>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col gap-1 border-b pb-3">
              <h2 className="text-lg font-bold">프리미엄 PR 옵션</h2>
              <p className="text-xs leading-relaxed text-gray-500">
                3D 투어, 호스트 영상, 드론 영상 등 유료 PR 콘텐츠를 적용한 숙소에만 사용합니다.
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <input
                type="checkbox"
                name="premiumPrIsPremium"
                defaultChecked={initialPremiumPr.isPremium}
                onChange={(e) => setIsPremiumPrEnabled(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
              />
              <span className="flex flex-col gap-1">
                <span className="text-sm font-bold text-gray-900">
                  프리미엄 PR 적용
                </span>
                <span className="text-xs leading-relaxed text-gray-500">
                  체크한 경우 공개 숙소 상세 화면에 검증된 PR 콘텐츠가 조건부로 노출됩니다.
                </span>
              </span>
            </label>

            {isPremiumPrEnabled && (
              <div className="flex flex-col gap-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                <div className="rounded-xl bg-white p-3 text-xs leading-relaxed text-amber-700">
                  허용 URL: Matterport <code className="font-mono">/show/</code>,
                  YouTube <code className="font-mono">/embed/</code>,
                  YouTube nocookie <code className="font-mono">/embed/</code>,
                  Vimeo player <code className="font-mono">/video/</code>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Matterport 3D 투어 URL
                  </label>
                  <input
                    name="premiumPrMatterportUrl"
                    type="url"
                    defaultValue={initialPremiumPr.features.matterportUrl || ""}
                    placeholder="https://my.matterport.com/show/?m=..."
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    호스트 영상 Embed URL
                  </label>
                  <input
                    name="premiumPrHostVideoUrl"
                    type="url"
                    defaultValue={initialPremiumPr.features.hostVideoUrl || ""}
                    placeholder="https://www.youtube.com/embed/..."
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    드론 영상 Embed URL
                  </label>
                  <input
                    name="premiumPrDroneViewUrl"
                    type="url"
                    defaultValue={initialPremiumPr.features.droneViewUrl || ""}
                    placeholder="https://player.vimeo.com/video/..."
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">
                      배지 문구
                    </label>
                    <input
                      name="premiumPrBadgeLabel"
                      defaultValue={initialPremiumPr.display.badgeLabel}
                      placeholder="3D 숙소 투어"
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">
                      PR 패키지명
                    </label>
                    <input
                      name="premiumPrPackageName"
                      defaultValue={initialPremiumPr.contract.packageName || ""}
                      placeholder="3D+호스트 영상 패키지"
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    노출 종료일
                  </label>
                  <input
                    name="premiumPrExpiresAt"
                    type="date"
                    defaultValue={initialPremiumPr.contract.expiresAt || ""}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">지도 표시 정보</h2>
            <div className="p-4 text-sm text-blue-600 bg-blue-50 rounded-xl">
              <strong>안내:</strong> 좌표가 입력된 숙소만 공개 지도에서 마커로 표시됩니다.
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
                <label className="text-sm font-semibold text-gray-700">위도</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  defaultValue={initialData?.latitude || ""}
                  placeholder="36.7876"
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">경도</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  defaultValue={initialData?.longitude || ""}
                  placeholder="126.1360"
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">외부 장소 ID</label>
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
                <option value="">선택 안함</option>
                <option value="manual">직접 입력</option>
                <option value="naver">네이버 지도</option>
                <option value="kakao">카카오맵</option>
                <option value="google">구글 지도</option>
              </select>
            </div>
          </section>
        </div>
      </div>

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
          {isPending ? "저장 중..." : initialData ? "수정하기" : "저장하기"}
        </button>
      </div>
    </form>
  );
}
