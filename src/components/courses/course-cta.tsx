import { InquiryDialog } from "@/components/inquiry/inquiry-dialog";

interface CourseCTAProps {
  itemId: string;
  itemSlug: string;
}

export function CourseCTA({ itemId, itemSlug }: CourseCTAProps) {
  return (
    <div className="bg-muted/30 border rounded-xl p-5 shadow-sm text-center">
      <h3 className="font-bold text-sm text-foreground mb-2">운영 및 상세 문의</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
        추천 코스는 일정 제안이며, 실제 운영 가능 여부는 관련 프로그램 확인 후 안내됩니다.
      </p>

      <InquiryDialog 
        itemType="course"
        itemId={itemId}
        itemSlug={itemSlug}
        variant="secondary"
        className="w-full"
      />
    </div>
  );
}
