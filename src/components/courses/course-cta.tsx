import { InquiryDialog } from "@/components/inquiry/inquiry-dialog";
import { getStaticLabels } from "@/lib/static-translations";

interface CourseCTAProps {
  itemId: string;
  itemSlug: string;
  locale?: string;
}

export function CourseCTA({ itemId, itemSlug, locale = "ko" }: CourseCTAProps) {
  const t = getStaticLabels(locale);
  
  return (
    <div className="bg-muted/30 border rounded-xl p-5 shadow-sm text-center">
      <h3 className="font-bold text-sm text-foreground mb-2">{t.courseCtaTitle}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
        {t.courseCtaDesc}
      </p>

      <InquiryDialog 
        itemType="course"
        itemId={itemId}
        itemSlug={itemSlug}
        variant="secondary"
        className="w-full"
        locale={locale}
      />
    </div>
  );
}
