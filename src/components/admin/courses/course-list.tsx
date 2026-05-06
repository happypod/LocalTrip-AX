"use client";

import Link from "next/link";
import { Course, CourseItem, PublishStatus, Region } from "@prisma/client";
import { updateCourseStatus } from "@/app/admin/courses/actions";

type CourseWithRelations = Course & {
  region: Region;
  courseItems: CourseItem[];
};

interface CourseListProps {
  courses: CourseWithRelations[];
}

export function CourseList({ courses }: CourseListProps) {
  async function handleStatusChange(id: string, newStatus: PublishStatus) {
    if (!confirm(`상태를 '${newStatus}'(으)로 변경하시겠습니까?\n공개(published)로 변경할 경우 포함된 모든 연결 항목도 공개 상태여야 합니다.`)) return;
    try {
      await updateCourseStatus(id, newStatus);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || "상태 변경 중 오류가 발생했습니다.");
      } else {
        alert("상태 변경 중 오류가 발생했습니다.");
      }
    }
  }

  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
        아직 등록된 코스가 없습니다.
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
              <th className="px-6 py-4 font-semibold">코스명 (Slug)</th>
              <th className="px-6 py-4 font-semibold">연결 항목 요약</th>
              <th className="px-6 py-4 font-semibold">상태</th>
              <th className="px-6 py-4 font-semibold text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.map((course) => {
              const stayCount = course.courseItems.filter(i => i.itemType === 'accommodation').length;
              const expCount = course.courseItems.filter(i => i.itemType === 'experience').length;
              const progCount = course.courseItems.filter(i => i.itemType === 'local_income_program').length;
              const totalCount = course.courseItems.length;

              return (
                <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">{course.region.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{course.title}</span>
                      <span className="text-xs text-gray-400">{course.slug}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-700 font-medium">총 {totalCount}개</span>
                      <span className="text-xs text-gray-500">
                        숙소 {stayCount} · 체험 {expCount} · 주민 {progCount}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={course.status} 
                      onChange={(e) => handleStatusChange(course.id, e.target.value as PublishStatus)}
                      className={`text-xs px-2 py-1 rounded-full font-medium border outline-none cursor-pointer ${
                        course.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
                        course.status === 'inactive' ? 'bg-red-50 text-red-700 border-red-200' :
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
                      href={`/admin/courses/${course.id}/edit`}
                      className="text-primary hover:underline font-medium text-sm px-3 py-1.5 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      수정
                    </Link>
                    <Link 
                      href={`/courses/${course.slug}`}
                      target="_blank"
                      className={`font-medium text-sm px-3 py-1.5 rounded-lg transition-colors ${
                        course.status === 'published' 
                          ? 'text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100'
                          : 'text-gray-300 bg-gray-50/50 cursor-not-allowed pointer-events-none'
                      }`}
                      title={course.status !== 'published' ? "공개 상태일 때만 확인할 수 있습니다." : ""}
                    >
                      보기
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
