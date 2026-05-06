"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Region, CourseItemType } from "@prisma/client";
import { createCourse, updateCourse, CourseData, CourseItemData } from "@/app/admin/courses/actions";
import { Trash2, Plus } from "lucide-react";

export interface ItemOption {
  id: string;
  title: string;
  regionId: string;
  status: string;
}

interface CourseFormProps {
  initialData?: CourseData & { id: string };
  regions: Region[];
  accommodations: ItemOption[];
  experiences: ItemOption[];
  programs: ItemOption[];
}

export function CourseForm({ initialData, regions, accommodations, experiences, programs }: CourseFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imagesInput, setImagesInput] = useState(initialData?.images?.join("\n") || "");
  const [selectedRegionId, setSelectedRegionId] = useState(initialData?.regionId || (regions.length > 0 ? regions[0].id : ""));
  
  // 초기 상태 로드 시 sortOrder 기준으로 정렬
  const initialItems = [...(initialData?.courseItems || [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const [courseItems, setCourseItems] = useState<CourseItemData[]>(initialItems);

  // 지역에 맞는 콘텐츠만 필터링
  const filteredAccommodations = accommodations.filter(a => a.regionId === selectedRegionId);
  const filteredExperiences = experiences.filter(e => e.regionId === selectedRegionId);
  const filteredPrograms = programs.filter(p => p.regionId === selectedRegionId);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRegionId = e.target.value;
    setSelectedRegionId(newRegionId);
    // 지역 변경 시 기존 선택된 항목들을 모두 초기화 (권역 불일치 방지)
    setCourseItems([]);
  };

  const addItem = (type: CourseItemType) => {
    setCourseItems(prev => [
      ...prev, 
      {
        itemType: type,
        sortOrder: prev.length,
        accommodationId: null,
        experienceId: null,
        localIncomeProgramId: null,
        note: ""
      }
    ]);
  };

  const removeItem = (index: number) => {
    setCourseItems(prev => {
      const newItems = [...prev];
      newItems.splice(index, 1);
      // sortOrder 재정렬
      return newItems.map((item, i) => ({ ...item, sortOrder: i }));
    });
  };

  const updateItem = (index: number, updates: Partial<CourseItemData>) => {
    setCourseItems(prev => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], ...updates };
      return newItems;
    });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === courseItems.length - 1) return;

    setCourseItems(prev => {
      const newItems = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      const temp = newItems[index];
      newItems[index] = newItems[targetIndex];
      newItems[targetIndex] = temp;

      // sortOrder 재정렬
      return newItems.map((item, i) => ({ ...item, sortOrder: i }));
    });
  };

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

    // 아이템 유효성 검증 프론트엔드
    for (let i = 0; i < courseItems.length; i++) {
      const item = courseItems[i];
      if (item.itemType === 'accommodation' && !item.accommodationId) {
        setError(`${i + 1}번째 항목(숙소)을 선택해주세요.`);
        setIsPending(false);
        return;
      }
      if (item.itemType === 'experience' && !item.experienceId) {
        setError(`${i + 1}번째 항목(체험)을 선택해주세요.`);
        setIsPending(false);
        return;
      }
      if (item.itemType === 'local_income_program' && !item.localIncomeProgramId) {
        setError(`${i + 1}번째 항목(주민소득상품)을 선택해주세요.`);
        setIsPending(false);
        return;
      }
    }

    const data: CourseData = {
      regionId: selectedRegionId,
      title: formData.get("title") as string,
      slug: slug,
      summary: formData.get("summary") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as string,
      images: imagesInput.split(/[\n,]+/).map(url => url.trim()).filter(Boolean),
      courseItems: courseItems,
    };

    try {
      if (initialData) {
        await updateCourse(initialData.id, data);
      } else {
        await createCourse(data);
      }
      router.push("/admin/courses");
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
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 whitespace-pre-wrap">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 기본 정보 */}
        <div className="flex flex-col gap-6">
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">기본 정보</h2>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">지역 (Region) <span className="text-red-500">*</span></label>
              <select 
                name="regionId" 
                value={selectedRegionId}
                onChange={handleRegionChange}
                required 
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="" disabled>지역을 선택하세요</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>{region.name} ({region.slug})</option>
                ))}
              </select>
              <span className="text-xs text-amber-600">※ 지역을 변경하면 하단에 추가된 코스 항목이 모두 초기화됩니다.</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">코스명 <span className="text-red-500">*</span></label>
              <input 
                name="title" 
                defaultValue={initialData?.title}
                required 
                placeholder="예: 파도리 감성 여행 1박 2일"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">슬러그 (Slug) <span className="text-red-500">*</span></label>
              <input 
                name="slug" 
                defaultValue={initialData?.slug}
                required 
                placeholder="padori-emotional-trip"
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
                placeholder="파도리 해변의 절경과 로컬 워크숍을 즐기는 코스"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">상세 설명</label>
              <textarea 
                name="description" 
                defaultValue={initialData?.description || ""}
                rows={4}
                placeholder="코스에 대한 상세 설명을 작성하세요."
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </div>
          </section>

          {/* 상태 및 이미지 */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold border-b pb-2">노출 및 썸네일</h2>
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
              <span className="text-xs text-gray-500">※ 공개 시 포함된 숙소, 체험, 주민소득상품 또한 모두 Published 상태여야 합니다.</span>
            </div>
            
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm font-semibold text-gray-700">이미지 URL 목록</label>
              <textarea 
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                rows={3}
                placeholder="https://example.com/image1.jpg"
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </div>
          </section>
        </div>

        {/* 코스 구성 항목 (우측) */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-bold text-primary">코스 구성 항목</h2>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => addItem("accommodation")}
                className="text-xs px-2 py-1 bg-category-stay text-white rounded hover:bg-category-stay/90 flex items-center"
              >
                <Plus className="w-3 h-3 mr-1" /> 숙소
              </button>
              <button 
                type="button" 
                onClick={() => addItem("experience")}
                className="text-xs px-2 py-1 bg-category-experience text-white rounded hover:bg-category-experience/90 flex items-center"
              >
                <Plus className="w-3 h-3 mr-1" /> 체험
              </button>
              <button 
                type="button" 
                onClick={() => addItem("local_income_program")}
                className="text-xs px-2 py-1 bg-category-program text-white rounded hover:bg-category-program/90 flex items-center"
              >
                <Plus className="w-3 h-3 mr-1" /> 주민
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-h-[300px]">
            {courseItems.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed rounded-xl">
                우측 상단 버튼을 눌러 코스 항목을 추가하세요.
              </div>
            ) : (
              courseItems.map((item, index) => (
                <div key={index} className="flex gap-3 items-start border rounded-xl p-4 bg-gray-50 relative group">
                  <div className="flex flex-col gap-1 items-center justify-center pt-2">
                    <button type="button" onClick={() => moveItem(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-primary disabled:opacity-30">▲</button>
                    <div className="w-6 h-6 flex items-center justify-center bg-white border rounded-full text-xs font-bold text-gray-500">
                      {index + 1}
                    </div>
                    <button type="button" onClick={() => moveItem(index, 'down')} disabled={index === courseItems.length - 1} className="text-gray-400 hover:text-primary disabled:opacity-30">▼</button>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded text-white
                        ${item.itemType === 'accommodation' ? 'bg-category-stay' : 
                          item.itemType === 'experience' ? 'bg-category-experience' : 'bg-category-program'}
                      `}>
                        {item.itemType === 'accommodation' ? '숙소' : 
                         item.itemType === 'experience' ? '체험' : '주민소득상품'}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => removeItem(index)}
                        className="text-red-400 hover:text-red-600 p-1"
                        title="항목 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-600">연결 대상 <span className="text-red-500">*</span></label>
                      <select 
                        value={
                          item.itemType === 'accommodation' ? (item.accommodationId || "") :
                          item.itemType === 'experience' ? (item.experienceId || "") :
                          (item.localIncomeProgramId || "")
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          updateItem(index, {
                            accommodationId: item.itemType === 'accommodation' ? val : null,
                            experienceId: item.itemType === 'experience' ? val : null,
                            localIncomeProgramId: item.itemType === 'local_income_program' ? val : null,
                          });
                        }}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full outline-none focus:border-primary"
                        required
                      >
                        <option value="" disabled>대상을 선택하세요</option>
                        {item.itemType === 'accommodation' && filteredAccommodations.map(a => (
                          <option key={a.id} value={a.id}>{a.title} {a.status !== 'published' ? `[${a.status}]` : ''}</option>
                        ))}
                        {item.itemType === 'experience' && filteredExperiences.map(e => (
                          <option key={e.id} value={e.id}>{e.title} {e.status !== 'published' ? `[${e.status}]` : ''}</option>
                        ))}
                        {item.itemType === 'local_income_program' && filteredPrograms.map(p => (
                          <option key={p.id} value={p.id}>{p.title} {p.status !== 'published' ? `[${p.status}]` : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-600">추가 안내 메모 (선택)</label>
                      <input 
                        type="text"
                        value={item.note || ""}
                        onChange={(e) => updateItem(index, { note: e.target.value })}
                        placeholder="예: 체크인 후 도보 5분 거리 이동"
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.push("/admin/courses")}
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
