"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CONTENT_TRANSLATION_LOCALES,
  ContentTranslationLocale,
  generateAITranslationPrompt,
} from "@/lib/content-translation";
import { saveContentTranslation } from "@/app/admin/translations/actions";
import { AlertCircle, Sparkles, X } from "lucide-react";

interface TranslationData {
  title: string | null;
  summary: string | null;
  description: string | null;
  linkedLifeService?: string | null;
  residentRole?: string | null;
  revenueUse?: string | null;
}

interface TranslationFormProps {
  targetType: string;
  targetId: string;
  originalData: TranslationData;
  existingTranslations: Record<string, TranslationData>;
}

const LOCALE_LABELS: Record<ContentTranslationLocale, string> = {
  en: "English (EN)",
  "zh-cn": "简体中文 (CN)",
  "ja-jp": "日本語 (JP)",
};

function emptyTranslationData(): TranslationData {
  return {
    title: "",
    summary: "",
    description: "",
    linkedLifeService: "",
    residentRole: "",
    revenueUse: "",
  };
}

function toSaveValue(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function TranslationForm({
  targetType,
  targetId,
  originalData,
  existingTranslations,
}: TranslationFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContentTranslationLocale>("en");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, TranslationData>>(
    CONTENT_TRANSLATION_LOCALES.reduce(
      (acc, locale) => {
        acc[locale] = {
          ...emptyTranslationData(),
          ...existingTranslations[locale],
        };
        return acc;
      },
      {} as Record<string, TranslationData>
    )
  );

  const activeData = formData[activeTab];
  const isLocalIncomeProgram = targetType === "local_income_program";

  const handleInputChange = (field: keyof TranslationData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value,
      },
    }));
  };

  const handleSave = async (locale: ContentTranslationLocale) => {
    setIsPending(true);
    setError(null);
    setSuccess(null);

    try {
      await saveContentTranslation(targetType, targetId, locale, {
        title: toSaveValue(formData[locale].title),
        summary: toSaveValue(formData[locale].summary),
        description: toSaveValue(formData[locale].description),
        linkedLifeService: toSaveValue(formData[locale].linkedLifeService),
        residentRole: toSaveValue(formData[locale].residentRole),
        revenueUse: toSaveValue(formData[locale].revenueUse),
      });
      setSuccess(`${LOCALE_LABELS[locale]} 번역을 저장했습니다.`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "번역 저장에 실패했습니다.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900">콘텐츠 다국어 번역</h2>
        <p className="text-sm text-gray-500">
          공개 화면에 표시할 영어, 중국어, 일본어 콘텐츠를 관리합니다. 비워 둔 항목은 한국어 원문 또는 영어 번역으로 대체됩니다.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <section className="flex flex-1 flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50 p-5">
          <h3 className="flex items-center gap-2 font-semibold text-gray-700">
            <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
              원문
            </span>
            한국어
          </h3>

          <div className="flex flex-col gap-3">
            <OriginalField label="제목 (Title)" value={originalData.title} />
            <OriginalField label="요약 (Summary)" value={originalData.summary} />
            <OriginalField
              label="상세 설명 (Description)"
              value={originalData.description}
              multiline
            />

            {isLocalIncomeProgram && (
              <>
                <OriginalField
                  label="연계 생활 서비스 (Linked Life Service)"
                  value={originalData.linkedLifeService}
                />
                <OriginalField
                  label="주민 역할 (Resident Role)"
                  value={originalData.residentRole}
                />
                <OriginalField
                  label="수익금 사용처 (Revenue Use)"
                  value={originalData.revenueUse}
                />
              </>
            )}
          </div>
        </section>

        <section className="flex flex-1 flex-col">
          <div className="mb-4 flex border-b border-gray-200">
            {CONTENT_TRANSLATION_LOCALES.map((locale) => (
              <button
                key={locale}
                type="button"
                onClick={() => {
                  setActiveTab(locale);
                  setError(null);
                  setSuccess(null);
                }}
                className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === locale
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {LOCALE_LABELS[locale]}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div className="mb-2 flex items-center justify-between rounded-lg border border-purple-100 bg-purple-50/50 p-3">
              <div className="flex flex-col">
                <span className="flex items-center gap-1.5 text-sm font-bold text-purple-900">
                  <Sparkles className="h-4 w-4" />
                  AI 번역 초안 준비
                </span>
                <span className="text-xs text-purple-700/80">
                  현재는 API 호출 없이 향후 연동용 프롬프트만 제공합니다.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAIModalOpen(true)}
                disabled={!originalData.title}
                className="flex items-center gap-1 rounded-lg bg-purple-100 px-3 py-1.5 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {!originalData.title ? (
                  <>
                    <AlertCircle className="h-3.5 w-3.5" />
                    원문 부족
                  </>
                ) : (
                  "프롬프트 보기"
                )}
              </button>
            </div>

            {error && (
              <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-green-100 bg-green-50 p-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <TranslationInput
              label="번역 제목"
              value={activeData.title}
              placeholder="해당 언어로 번역한 제목"
              onChange={(value) => handleInputChange("title", value)}
            />
            <TranslationInput
              label="번역 요약"
              value={activeData.summary}
              placeholder="해당 언어로 번역한 요약"
              onChange={(value) => handleInputChange("summary", value)}
            />
            <TranslationTextarea
              label="번역 상세 설명"
              value={activeData.description}
              placeholder="해당 언어로 번역한 상세 설명"
              onChange={(value) => handleInputChange("description", value)}
            />

            {isLocalIncomeProgram && (
              <>
                <TranslationInput
                  label="번역 연계 생활 서비스"
                  value={activeData.linkedLifeService}
                  placeholder="해당 언어로 번역한 연계 생활 서비스"
                  onChange={(value) =>
                    handleInputChange("linkedLifeService", value)
                  }
                />
                <TranslationInput
                  label="번역 주민 역할"
                  value={activeData.residentRole}
                  placeholder="해당 언어로 번역한 주민 역할"
                  onChange={(value) => handleInputChange("residentRole", value)}
                />
                <TranslationInput
                  label="번역 수익금 사용처"
                  value={activeData.revenueUse}
                  placeholder="해당 언어로 번역한 수익금 사용처"
                  onChange={(value) => handleInputChange("revenueUse", value)}
                />
              </>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => handleSave(activeTab)}
                disabled={isPending}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending
                  ? "저장 중..."
                  : `${LOCALE_LABELS[activeTab]} 번역 저장`}
              </button>
            </div>
          </div>
        </section>
      </div>

      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2 font-bold text-purple-700">
                <Sparkles className="h-5 w-5" />
                AI 번역 초안 연동 예정
              </div>
              <button
                type="button"
                onClick={() => setIsAIModalOpen(false)}
                className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto p-6">
              <div className="rounded-xl border border-purple-100 bg-purple-50 p-4 text-sm leading-relaxed text-purple-900">
                현재는 AI API를 호출하지 않습니다. 아래 프롬프트는 향후 번역 초안 생성 API에 전달할 기준 문안입니다.
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-gray-700">
                  생성할 프롬프트 미리보기
                </span>
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
                  {generateAITranslationPrompt(
                    targetType,
                    activeTab,
                    originalData.title,
                    originalData.summary,
                    originalData.description,
                    {
                      linkedLifeService: originalData.linkedLifeService ?? undefined,
                      residentRole: originalData.residentRole ?? undefined,
                      revenueUse: originalData.revenueUse ?? undefined,
                    }
                  )}
                </pre>
              </div>
            </div>

            <div className="flex justify-end border-t p-4">
              <button
                type="button"
                onClick={() => setIsAIModalOpen(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OriginalField({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value?: string | null;
  multiline?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="mb-1 text-xs font-semibold text-gray-500">{label}</span>
      <p
        className={`rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-900 ${
          multiline ? "whitespace-pre-wrap" : ""
        }`}
      >
        {value || <span className="text-gray-400 italic">없음</span>}
      </p>
    </div>
  );
}

function TranslationInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value?: string | null;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function TranslationTextarea({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value?: string | null;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <textarea
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        placeholder={placeholder}
        className="resize-none rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
