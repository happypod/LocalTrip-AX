"use client";

import Link from "next/link";
import { BusinessProfile, PublishStatus, Region } from "@prisma/client";
import { updateBusinessStatus } from "@/app/admin/businesses/actions";
import { maskPhone } from "@/lib/privacy";

type BusinessProfileWithRegion = BusinessProfile & {
  region: Region;
};

interface BusinessListProps {
  businesses: BusinessProfileWithRegion[];
}

export function BusinessList({ businesses }: BusinessListProps) {
  async function handleStatusChange(id: string, newStatus: PublishStatus) {
    if (!confirm(`상태를 '${newStatus}'(으)로 변경하시겠습니까?`)) return;
    try {
      await updateBusinessStatus(id, newStatus);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || "상태 변경 중 오류가 발생했습니다.");
      } else {
        alert("상태 변경 중 오류가 발생했습니다.");
      }
    }
  }

  if (businesses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
        아직 등록된 사업자 프로필이 없습니다.
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
              <th className="px-6 py-4 font-semibold">사업자/단체명</th>
              <th className="px-6 py-4 font-semibold">대표자</th>
              <th className="px-6 py-4 font-semibold">연락처</th>
              <th className="px-6 py-4 font-semibold">상태</th>
              <th className="px-6 py-4 font-semibold text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {businesses.map((business) => (
              <tr key={business.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-gray-500">{business.region.name}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{business.name}</td>
                <td className="px-6 py-4 text-gray-500">{business.ownerName || "-"}</td>
                <td className="px-6 py-4 text-gray-500">
                  {business.phone ? maskPhone(business.phone) : "-"}
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={business.status} 
                    onChange={(e) => handleStatusChange(business.id, e.target.value as PublishStatus)}
                    className={`text-xs px-2 py-1 rounded-full font-medium border outline-none cursor-pointer ${
                      business.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
                      business.status === 'inactive' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    <option value="published">공개</option>
                    <option value="draft">임시저장</option>
                    <option value="inactive">비활성</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    href={`/admin/businesses/${business.id}/edit`}
                    className="text-primary hover:underline font-medium text-sm px-3 py-1.5 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    수정
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
