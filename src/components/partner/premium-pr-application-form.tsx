"use client";

import { useState } from "react";
import {
  AlertCircle,
  BadgeCheck,
  Camera,
  CheckCircle2,
  Cuboid,
  Loader2,
  MessageSquareText,
  Plane,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ServiceId =
  | "matterport_3d"
  | "host_video"
  | "drone_video"
  | "detail_page_pr"
  | "annual_premium_exposure"
  | "consulting";

const SERVICE_OPTIONS: Array<{
  id: ServiceId;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    id: "matterport_3d",
    label: "3D/VR 투어 촬영",
    description: "숙소 내부를 미리 둘러볼 수 있는 랜선 투어",
    icon: <Cuboid className="h-5 w-5" />,
  },
  {
    id: "host_video",
    label: "호스트 인터뷰 영상",
    description: "운영자의 이야기와 공간의 매력을 담는 짧은 영상",
    icon: <Video className="h-5 w-5" />,
  },
  {
    id: "drone_video",
    label: "드론 영상",
    description: "해안, 마을, 접근 동선을 보여주는 항공 영상",
    icon: <Plane className="h-5 w-5" />,
  },
  {
    id: "detail_page_pr",
    label: "상세페이지 PR 콘텐츠",
    description: "사진, 소개 문안, 썸네일 구성 지원",
    icon: <Camera className="h-5 w-5" />,
  },
  {
    id: "annual_premium_exposure",
    label: "연간 프리미엄 노출 관리",
    description: "플랫폼 내 프리미엄 노출 상태 운영",
    icon: <BadgeCheck className="h-5 w-5" />,
  },
  {
    id: "consulting",
    label: "상담 후 결정",
    description: "제작 범위를 상담하며 정하고 싶어요",
    icon: <MessageSquareText className="h-5 w-5" />,
  },
];

const INITIAL_FORM = {
  operatorType: "",
  businessName: "",
  applicantName: "",
  phone: "",
  email: "",
  regionName: "",
  address: "",
  currentWebsiteUrl: "",
  preferredSchedule: "",
  budgetRange: "",
  requestMemo: "",
  privacyAgreed: false,
};

export function PremiumPrApplicationForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [selectedServices, setSelectedServices] = useState<ServiceId[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleService = (service: ServiceId) => {
    setSelectedServices((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service]
    );
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedServices.length === 0) {
      setError("관심 제작 항목을 하나 이상 선택해 주세요.");
      return;
    }

    if (!formData.privacyAgreed) {
      setError("개인정보 수집 및 이용 동의가 필요합니다.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/premium-pr-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          interestedServices: selectedServices,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        if (result.error === "PRIVACY_AGREEMENT_REQUIRED") {
          throw new Error("개인정보 수집 및 이용 동의가 필요합니다.");
        }
        if (result.error === "INVALID_SERVICES") {
          throw new Error("관심 제작 항목을 다시 확인해 주세요.");
        }
        throw new Error(
          "제작 문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
      }

      setIsSuccess(true);
      setFormData(INITIAL_FORM);
      setSelectedServices([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-6 py-12 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-950">
          프리미엄 PR 제작 문의가 접수되었습니다
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600">
          운영자가 신청 내용을 확인한 뒤 상담 연락을 드립니다. 접수는 제작
          일정이나 결제를 확정하는 절차가 아닙니다.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-7 rounded-xl"
          onClick={() => setIsSuccess(false)}
        >
          추가 문의 작성
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-black text-gray-950">관심 제작 항목</h2>
        <p className="mt-1 text-sm text-gray-500">
          필요한 제작 항목을 하나 이상 선택해 주세요.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SERVICE_OPTIONS.map((service) => {
            const isSelected = selectedServices.includes(service.id);

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                aria-pressed={isSelected}
                className={cn(
                  "flex min-h-24 items-start gap-3 rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-white"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    isSelected ? "bg-primary text-white" : "bg-white text-gray-500"
                  )}
                >
                  {service.icon}
                </span>
                <span>
                  <span className="block text-sm font-black">
                    {service.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-gray-500">
                    {service.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-black text-gray-950">신청자 정보</h2>
        <div className="mt-5 grid grid-cols-1 gap-5">
          <div className="grid gap-2">
            <Label htmlFor="operatorType">운영 주체 유형</Label>
            <Input
              id="operatorType"
              value={formData.operatorType}
              onChange={(event) =>
                setFormData({ ...formData, operatorType: event.target.value })
              }
              placeholder="예: 숙소 운영자, 마을기업, 협동조합"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="businessName">사업장/단체명</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(event) =>
                setFormData({ ...formData, businessName: event.target.value })
              }
              placeholder="예: 소원 바다민박"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="applicantName">신청자명 *</Label>
            <Input
              id="applicantName"
              value={formData.applicantName}
              onChange={(event) =>
                setFormData({ ...formData, applicantName: event.target.value })
              }
              placeholder="담당자 이름"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">연락처 *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(event) =>
                setFormData({ ...formData, phone: event.target.value })
              }
              placeholder="010-0000-0000"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
              placeholder="contact@example.com"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-black text-gray-950">제작 대상 정보</h2>
        <div className="mt-5 grid grid-cols-1 gap-5">
          <div className="grid gap-2">
            <Label htmlFor="regionName">지역</Label>
            <Input
              id="regionName"
              value={formData.regionName}
              onChange={(event) =>
                setFormData({ ...formData, regionName: event.target.value })
              }
              placeholder="예: 소원면, 만리포 인근"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">주소</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(event) =>
                setFormData({ ...formData, address: event.target.value })
              }
              placeholder="촬영 상담을 위한 대략 주소"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="currentWebsiteUrl">현재 홈페이지 또는 예약 링크</Label>
            <Input
              id="currentWebsiteUrl"
              value={formData.currentWebsiteUrl}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  currentWebsiteUrl: event.target.value,
                })
              }
              placeholder="https://"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="preferredSchedule">희망 일정</Label>
            <Input
              id="preferredSchedule"
              value={formData.preferredSchedule}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  preferredSchedule: event.target.value,
                })
              }
              placeholder="예: 6월 평일 오전, 상담 후 결정"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="budgetRange">예산 범위 또는 상담 희망 여부</Label>
            <Input
              id="budgetRange"
              value={formData.budgetRange}
              onChange={(event) =>
                setFormData({ ...formData, budgetRange: event.target.value })
              }
              placeholder="예: 상담 희망, 100만원 이하"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="requestMemo">요청 메모</Label>
            <Textarea
              id="requestMemo"
              value={formData.requestMemo}
              onChange={(event) =>
                setFormData({ ...formData, requestMemo: event.target.value })
              }
              placeholder="공간 특징, 촬영 희망 내용, 상담이 필요한 점을 적어 주세요."
              className="min-h-32 resize-none"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 border-t pt-6">
        <div className="flex items-start gap-3 rounded-2xl border bg-muted/40 p-4">
          <Checkbox
            id="premiumPrPrivacy"
            checked={formData.privacyAgreed}
            onCheckedChange={(checked) => {
              setFormData({ ...formData, privacyAgreed: checked === true });
              setError(null);
            }}
            disabled={isSubmitting}
            className="mt-1"
          />
          <div className="grid gap-1.5">
            <Label
              htmlFor="premiumPrPrivacy"
              className="cursor-pointer text-sm font-bold"
            >
              개인정보 수집 및 이용에 동의합니다. *
            </Label>
            <p className="text-xs leading-relaxed text-muted-foreground">
              입력 정보는 Premium PR 제작 상담과 운영자 연락 목적으로만
              사용됩니다. 접수는 제작 일정, 계약, 결제를 확정하는 절차가
              아닙니다.
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="h-14 w-full rounded-2xl text-base font-black"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              접수 중
            </>
          ) : (
            "제작 문의 접수하기"
          )}
        </Button>
      </section>
    </form>
  );
}
