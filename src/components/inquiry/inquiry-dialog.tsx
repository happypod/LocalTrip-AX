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
      setError(t.inquiryNameError);
      return;
    }
    if (!formData.phone.trim()) {
      setError(t.inquiryPhoneError);
      return;
    }
    if (!formData.privacyAgreed) {
      setError(t.inquiryPrivacyError);
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
          throw new Error(t.inquiryPrivacyError);
        }
        if (data.error === "INVALID_INPUT") {
          throw new Error(t.inquiryInvalidInputError);
        }
        throw new Error(t.inquiryErrorDefault);
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || t.inquiryErrorDefault);
      } else {
        setError(t.inquiryErrorDefault);
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
          <DialogTitle>{t.inquiryDialogTitle}</DialogTitle>
          <DialogDescription>
            {t.inquiryDialogDescription}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-foreground">{t.inquirySuccessTitle}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {t.inquirySuccessDescription}
              </p>
            </div>
            <Button onClick={() => handleOpenChange(false)} className="mt-4 w-full">
              {t.inquiryClose}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-semibold">{t.inquiryNameLabel}</Label>
              <Input
                id="name"
                name="name"
                placeholder={t.inquiryNamePlaceholder}
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-sm font-semibold">{t.inquiryPhoneLabel}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder={t.inquiryPhonePlaceholder}
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-semibold text-muted-foreground">{t.inquiryEmailLabel}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t.inquiryEmailPlaceholder}
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="desiredDate" className="text-sm font-semibold text-muted-foreground">{t.inquiryDesiredDateLabel}</Label>
                <Input
                  id="desiredDate"
                  name="desiredDate"
                  placeholder={t.inquiryDesiredDatePlaceholder}
                  value={formData.desiredDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="peopleCount" className="text-sm font-semibold text-muted-foreground">{t.inquiryPeopleCountLabel}</Label>
                <Input
                  id="peopleCount"
                  name="peopleCount"
                  type="number"
                  min="1"
                  placeholder={t.inquiryPeopleCountPlaceholder}
                  value={formData.peopleCount}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message" className="text-sm font-semibold text-muted-foreground">{t.inquiryMessageLabel}</Label>
              <Textarea
                id="message"
                name="message"
                placeholder={t.inquiryMessagePlaceholder}
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
                    {t.inquiryPrivacyLabel}
                  </Label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.inquiryPrivacyDescription}
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.inquirySubmitting}
                </>
              ) : (
                finalButtonText
              )}
            </Button>
            
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
