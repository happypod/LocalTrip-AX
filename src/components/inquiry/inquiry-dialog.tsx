"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { getStaticLabels } from "@/lib/static-translations";

interface InquiryDialogProps {
  itemType: "accommodation" | "experience" | "local_income_program" | "course";
  itemId: string;
  itemSlug: string;
  buttonText?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon" | "xl";
  locale?: string;
}

export function InquiryDialog({ 
  itemType, 
  itemId, 
  itemSlug, 
  buttonText,
  className,
  variant = "secondary",
  size = "default",
  locale = "ko"
}: InquiryDialogProps) {
  const t = getStaticLabels(locale);
  const finalButtonText = buttonText || t.inquiryBtn;
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    desiredDate: "",
    peopleCount: "",
    message: "",
    privacyAgreed: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validations
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError("이름을 2자 이상 입력해 주세요.");
      return;
    }
    if (!formData.phone.trim()) {
      setError("연락처를 입력해 주세요.");
      return;
    }
    if (!formData.privacyAgreed) {
      setError("개인정보 수집·이용 동의가 필요합니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType,
          itemId,
          itemSlug,
          ...formData,
          peopleCount: formData.peopleCount ? parseInt(formData.peopleCount, 10) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        if (data.error === "PRIVACY_AGREEMENT_REQUIRED") {
          throw new Error("개인정보 수집·이용 동의가 필요합니다.");
        }
        if (data.error === "INVALID_INPUT") {
          throw new Error("필수 항목을 올바르게 입력해 주세요.");
        }
        throw new Error("문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      } else {
        setError("문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setError(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      desiredDate: "",
      peopleCount: "",
      message: "",
      privacyAgreed: false,
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset after animation completes
      setTimeout(resetForm, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant={variant} size={size} className={cn("gap-2", className)} />}>
        <MessageSquare className="w-4 h-4" />
        {finalButtonText}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>문의하기</DialogTitle>
          <DialogDescription>
            운영 일정과 가능 여부는 운영자 확인 후 안내됩니다. (이 문의는 예약 확정이 아닙니다.)
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-foreground">문의가 접수되었습니다.</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                운영자가 내용 확인 후 기재해주신<br/>연락처로 안내해 드릴 예정입니다.
              </p>
            </div>
            <Button onClick={() => handleOpenChange(false)} className="mt-4 w-full">
              닫기
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-semibold">이름 (필수)</Label>
              <Input
                id="name"
                name="name"
                placeholder="예: 홍길동"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-sm font-semibold">연락처 (필수)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="예: 010-1234-5678"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-semibold text-muted-foreground">이메일 (선택)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="답변 받을 이메일 주소"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="desiredDate" className="text-sm font-semibold text-muted-foreground">희망일 (선택)</Label>
                <Input
                  id="desiredDate"
                  name="desiredDate"
                  placeholder="예: 7/20"
                  value={formData.desiredDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="peopleCount" className="text-sm font-semibold text-muted-foreground">인원 (선택)</Label>
                <Input
                  id="peopleCount"
                  name="peopleCount"
                  type="number"
                  min="1"
                  placeholder="예: 4"
                  value={formData.peopleCount}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message" className="text-sm font-semibold text-muted-foreground">문의내용 (선택)</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="궁금한 점이나 추가 요청사항을 남겨주세요."
                rows={3}
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                className="resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md font-medium">
                {error}
              </p>
            )}

            <div className="mt-2 p-4 bg-muted/50 rounded-lg border flex flex-col gap-3">
              <div className="flex items-start gap-3">
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
                    className="text-sm font-semibold leading-snug cursor-pointer"
                  >
                    개인정보 수집·이용에 동의합니다.
                  </Label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    입력하신 정보는 문의 확인 및 답변을 위해서만 사용되며, 예약 확정 또는 결제 정보로 사용되지 않습니다.
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  제출 중...
                </>
              ) : (
                "문의 남기기"
              )}
            </Button>
            
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
