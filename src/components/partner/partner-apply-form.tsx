"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Loader2, Store, Home, Compass, UserCircle, Utensils, Gift, Users, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type ApplicantType = 
  | "accommodation_owner"
  | "experience_host"
  | "local_income_program"
  | "local_guide"
  | "food_operator"
  | "local_product"
  | "resident_group"
  | "cooperative"
  | "other";

interface PartnerTypeOption {
  id: ApplicantType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const PARTNER_TYPES: PartnerTypeOption[] = [
  { id: "accommodation_owner", label: "숙소 운영자", description: "펜션, 민박, 게스트하우스, 마을숙박 등", icon: <Home className="w-5 h-5" /> },
  { id: "experience_host", label: "체험 운영자", description: "해변, 어촌, 공방, 음식, ESG 체험 등", icon: <Compass className="w-5 h-5" /> },
  { id: "local_income_program", label: "주민소득 프로그램", description: "로컬밥상, 감태체험, 바다물길 놀이터 등", icon: <Users className="w-5 h-5" /> },
  { id: "local_guide", label: "로컬가이드", description: "마을해설, 어촌 아침산책, 노을산책 등", icon: <UserCircle className="w-5 h-5" /> },
  { id: "food_operator", label: "식음 운영자", description: "식당, 카페, 로컬밥상, 간식 판매 등", icon: <Utensils className="w-5 h-5" /> },
  { id: "local_product", label: "로컬상품 판매자", description: "감태, 수산물, 공예품, 굿즈 등", icon: <Gift className="w-5 h-5" /> },
  { id: "resident_group", label: "주민단체", description: "부녀회, 청년회, 주민협의체 등", icon: <Store className="w-5 h-5" /> },
  { id: "cooperative", label: "협동조합", description: "지역 기반 사회적 기업 및 협동조합", icon: <Store className="w-5 h-5" /> },
  { id: "other", label: "기타", description: "그 외 다양한 지역 기반 사업 및 제안", icon: <MoreHorizontal className="w-5 h-5" /> },
];

export function PartnerApplyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    applicantType: "" as ApplicantType | "",
    businessName: "",
    applicantName: "",
    phone: "",
    email: "",
    regionName: "",
    address: "",
    currentWebsiteUrl: "",
    naverBookingUrl: "",
    kakaoUrl: "",
    proposedTitle: "",
    proposedDescription: "",
    operationType: "",
    availableSeason: "",
    expectedParticipants: "",
    privacyAgreed: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.applicantType) {
      setError("신청자 유형을 선택해 주세요.");
      return;
    }

    if (!formData.privacyAgreed) {
      setError("개인정보 수집·이용 동의가 필요합니다.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/partner-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        if (data.error === "PRIVACY_AGREEMENT_REQUIRED") {
          throw new Error("개인정보 수집·이용 동의가 필요합니다.");
        }
        throw new Error("입점신청 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-3">입점신청이 접수되었습니다</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed max-w-sm">
          소원로컬트립과 함께해 주셔서 감사합니다.<br />
          운영자가 내용을 확인한 뒤 빠른 시일 내에 안내 연락을 드리겠습니다.
        </p>
        <Button onClick={() => window.location.href = "/"} variant="outline" className="min-w-[140px]">
          홈으로 이동
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {/* 1. 신청자 유형 선택 */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold">1. 신청자 유형 선택 (필수)</h3>
          <p className="text-sm text-muted-foreground">가장 잘 어울리는 유형을 선택해 주세요.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PARTNER_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setFormData({ ...formData, applicantType: type.id })}
              aria-pressed={formData.applicantType === type.id}
              className={cn(
                "flex items-start text-left gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                formData.applicantType === type.id 
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                  : "border-border bg-card"
              )}
            >
              <div className={cn(
                "mt-0.5 p-2 rounded-lg shrink-0",
                formData.applicantType === type.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}>
                {type.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-sm text-foreground">{type.label}</span>
                <span className="text-xs text-muted-foreground leading-tight">{type.description}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. 기본 정보 */}
      <section className="flex flex-col gap-6">
        <h3 className="text-lg font-bold">2. 운영자 정보</h3>
        
        <div className="grid grid-cols-1 gap-5">
          <div className="grid gap-2">
            <Label htmlFor="applicantName">담당자 또는 성함 (필수)</Label>
            <Input 
              id="applicantName" 
              placeholder="홍길동"
              required
              value={formData.applicantName}
              onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">연락처 (필수)</Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="010-1234-5678"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="businessName">업체명 또는 단체명 (선택)</Label>
            <Input 
              id="businessName" 
              placeholder="소원 바다체험"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">이메일 (선택)</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="contact@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="regionName">운영 희망 지역 (선택)</Label>
            <Input 
              id="regionName" 
              placeholder="예: 만리포 해수욕장 주변, 소원면 소근리"
              value={formData.regionName}
              onChange={(e) => setFormData({ ...formData, regionName: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </section>

      {/* 3. 콘텐츠 정보 */}
      <section className="flex flex-col gap-6">
        <h3 className="text-lg font-bold">3. 제안 콘텐츠 정보</h3>
        
        <div className="grid grid-cols-1 gap-5">
          <div className="grid gap-2">
            <Label htmlFor="proposedTitle">제안하고 싶은 상품명 (선택)</Label>
            <Input 
              id="proposedTitle" 
              placeholder="예: 우리집 어촌 밥상 체험"
              value={formData.proposedTitle}
              onChange={(e) => setFormData({ ...formData, proposedTitle: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="proposedDescription">운영 가능한 콘텐츠 설명 (선택)</Label>
            <Textarea 
              id="proposedDescription" 
              placeholder="제안하고 싶은 체험, 숙소, 프로그램의 특징을 자유롭게 적어주세요."
              className="min-h-[120px] resize-none"
              value={formData.proposedDescription}
              onChange={(e) => setFormData({ ...formData, proposedDescription: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="availableSeason">운영 가능 시기 (선택)</Label>
              <Input 
                id="availableSeason" 
                placeholder="예: 사계절 가능, 하절기만 가능"
                value={formData.availableSeason}
                onChange={(e) => setFormData({ ...formData, availableSeason: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expectedParticipants">예상 참여 인원 (선택)</Label>
              <Input 
                id="expectedParticipants" 
                placeholder="예: 최대 10명, 단체 가능"
                value={formData.expectedParticipants}
                onChange={(e) => setFormData({ ...formData, expectedParticipants: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. 기존 운영 링크 */}
      <section className="flex flex-col gap-6">
        <h3 className="text-lg font-bold">4. 기존 채널 정보 (선택)</h3>
        <p className="text-xs text-muted-foreground -mt-4">운영 중인 SNS나 예약 페이지가 있다면 적어주세요.</p>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="currentWebsiteUrl" className="text-xs">홈페이지 또는 SNS (인스타그램 등)</Label>
            <Input 
              id="currentWebsiteUrl" 
              placeholder="https://"
              value={formData.currentWebsiteUrl}
              onChange={(e) => setFormData({ ...formData, currentWebsiteUrl: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="naverBookingUrl" className="text-xs">네이버 예약 페이지</Label>
            <Input 
              id="naverBookingUrl" 
              placeholder="https://booking.naver.com/..."
              value={formData.naverBookingUrl}
              onChange={(e) => setFormData({ ...formData, naverBookingUrl: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </section>

      {/* 5. 개인정보 동의 및 제출 */}
      <section className="flex flex-col gap-6 pt-6 border-t">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl border">
            <Checkbox 
              id="privacy" 
              checked={formData.privacyAgreed}
              onCheckedChange={(checked) => {
                setFormData({ ...formData, privacyAgreed: checked === true });
                setError(null);
              }}
              disabled={isSubmitting}
              className="mt-1"
            />
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor="privacy"
                className="text-sm font-bold cursor-pointer"
              >
                개인정보 수집·이용에 동의합니다. (필수)
              </Label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                입력하신 정보는 소원로컬트립 플랫폼 입점 검토와 안내 연락을 위해서만 사용되며, 
                제출 후 상담 절차를 거쳐 입점이 확정됩니다.
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-14 text-base font-bold shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                접수 중...
              </>
            ) : "입점신청 완료하기"}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground">
            신청 후 운영자가 내용을 확인한 뒤 입점 가능 여부와 필요한 정보를 안내드립니다.<br />
            이 신청은 상품 판매나 예약을 보장하지 않습니다.
          </p>
        </div>
      </section>
    </form>
  );
}
