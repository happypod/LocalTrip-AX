"use client";

import Link from "next/link";
import { TrainingCourse, PublishStatus, Region } from "@prisma/client";
import { updateTrainingCourseStatus } from "@/app/admin/training/actions";

type TrainingCourseWithRegion = TrainingCourse & {
  region: Region;
};

interface TrainingCourseListProps {
  courses: TrainingCourseWithRegion[];
}

export function TrainingCourseList({ courses }: TrainingCourseListProps) {
  async function handleStatusChange(id: string, newStatus: PublishStatus) {
    if (!confirm(`상태를 '${newStatus}'(으)로 변경하시겠습니까?`)) return;
    try {
      await updateTrainingCourseStatus(id, newStatus);
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
        등록된 교육과정이 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold">권역</th>
              <th className="px-6 py-4 font-semibold">교육과정명</th>
              <th className="px-6 py-4 font-semibold">요약</th>
              <th className="px-6 py-4 font-semibold">생성일</th>
              <th className="px-6 py-4 font-semibold">상태</th>
              <th className="px-6 py-4 font-semibold text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-gray-500 font-medium">{course.region.name}</td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900">{course.title}</span>
                </td>
                <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">
                  {course.summary || <span className="text-gray-300">-</span>}
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {new Date(course.createdAt).toLocaleDateString()}
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
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    href={`/admin/training/courses/${course.id}/edit`}
                    className="text-primary hover:underline font-medium text-sm px-3 py-1.5 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors inline-block"
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
