"use client";

import Link from "next/link";
import { Experience, PublishStatus, Region, BusinessProfile } from "@prisma/client";
import { updateExperienceStatus } from "@/app/admin/experiences/actions";
import { maskPhone } from "@/lib/privacy";

type ExperienceWithRelations = Experience & {
  region: Region;
  businessProfile: BusinessProfile | null;
};

interface ExperienceListProps {
  experiences: ExperienceWithRelations[];
}

export function ExperienceList({ experiences }: ExperienceListProps) {
  async function handleStatusChange(id: string, newStatus: PublishStatus) {
    if (!confirm(`상태를 '${newStatus}'(으)로 변경하시겠습니까?`)) return;
    try {
      await updateExperienceStatus(id, newStatus);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || "상태 변경 중 오류가 발생했습니다.");
      } else {
        alert("상태 변경 중 오류가 발생했습니다.");
      }
    }
  }

  if (experiences.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
        아직 등록된 체험이 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold">지역</th>
              <th className="px-6 py-4 font-semibold">사업자/운영자</th>
              <th className="px-6 py-4 font-semibold">체험명 (Slug)</th>
              <th className="px-6 py-4 font-semibold hidden md:table-cell">지도</th>
              <th className="px-6 py-4 font-semibold">연락처</th>
              <th className="px-6 py-4 font-semibold">상태</th>
              <th className="px-6 py-4 font-semibold text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {experiences.map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-gray-500">{exp.region.name}</td>
                <td className="px-6 py-4 text-gray-500">
                  {exp.businessProfile?.name || <span className="text-gray-300">미지정</span>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{exp.title}</span>
                    <span className="text-xs text-gray-400">{exp.slug}</span>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  {exp.latitude && exp.longitude ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-md">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      좌표 있음
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">
                      좌표 미입력
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {exp.phone ? maskPhone(exp.phone) : "-"}
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={exp.status} 
                    onChange={(e) => handleStatusChange(exp.id, e.target.value as PublishStatus)}
                    className={`text-xs px-2 py-1 rounded-full font-medium border outline-none cursor-pointer ${
                      exp.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
                      exp.status === 'inactive' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td className="px-6 py-4 flex items-center justify-end gap-2">
                  <Link 
                    href={`/admin/experiences/${exp.id}/edit`}
                    className="text-primary hover:underline font-medium text-sm px-3 py-1.5 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    수정
                  </Link>
                  <Link 
                    href={`/experiences/${exp.slug}`}
                    target="_blank"
                    className={`font-medium text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      exp.status === 'published' 
                        ? 'text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100'
                        : 'text-gray-300 bg-gray-50/50 cursor-not-allowed pointer-events-none'
                    }`}
                    title={exp.status !== 'published' ? "공개 상태일 때만 확인할 수 있습니다." : ""}
                  >
                    보기
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
