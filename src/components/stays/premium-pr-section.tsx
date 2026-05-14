"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { BadgeCheck, Box, Plane, PlayCircle, Video } from "lucide-react";
import type { PremiumPrConfig } from "@/lib/premium-pr";
import {
  isAllowedPremiumPrIframeUrl,
  normalizePremiumPr,
} from "@/lib/premium-pr";
import { trackLeadEvent, type LeadActionType } from "@/lib/lead-event";
import { PremiumPrModal } from "./premium-pr-modal";

type ModalState = {
  title: string;
  url: string;
} | null;

type PremiumPrFeature = "matterport" | "host_video" | "drone_video";
type PremiumPrPlacement =
  | "hero_badge"
  | "section_button"
  | "video_card";

interface PremiumPrProps {
  premiumPr: unknown;
  stayTitle: string;
  itemId: string;
  itemSlug: string;
}

function getValidUrl(url: string | null) {
  return isAllowedPremiumPrIframeUrl(url) ? url : null;
}

function getPremiumPrMedia(premiumPr: PremiumPrConfig) {
  if (!premiumPr.isPremium) {
    return {
      matterportUrl: null,
      hostVideoUrl: null,
      droneViewUrl: null,
    };
  }

  return {
    matterportUrl: getValidUrl(premiumPr.features.matterportUrl),
    hostVideoUrl: getValidUrl(premiumPr.features.hostVideoUrl),
    droneViewUrl: getValidUrl(premiumPr.features.droneViewUrl),
  };
}

function hasAnyPremiumMedia(media: ReturnType<typeof getPremiumPrMedia>) {
  return Boolean(media.matterportUrl || media.hostVideoUrl || media.droneViewUrl);
}

function getPremiumPrAction(feature: PremiumPrFeature): LeadActionType {
  if (feature === "matterport") return "premium_pr_matterport_click";
  if (feature === "host_video") return "premium_pr_host_video_click";
  return "premium_pr_drone_video_click";
}

function trackPremiumPrClick({
  itemId,
  itemSlug,
  feature,
  placement,
  targetUrl,
}: {
  itemId: string;
  itemSlug: string;
  feature: PremiumPrFeature;
  placement: PremiumPrPlacement;
  targetUrl: string;
}) {
  trackLeadEvent({
    itemType: "accommodation",
    itemId,
    itemSlug,
    actionType: getPremiumPrAction(feature),
    targetUrl,
    metadata: {
      premiumPrFeature: feature,
      premiumPrPlacement: placement,
    },
  });
}

function PremiumVideoEmbed({
  title,
  description,
  url,
  icon,
  feature,
  itemId,
  itemSlug,
}: {
  title: string;
  description: string;
  url: string;
  icon: ReactNode;
  feature: Exclude<PremiumPrFeature, "matterport">;
  itemId: string;
  itemSlug: string;
}) {
  const [hasTrackedInteraction, setHasTrackedInteraction] = useState(false);

  const handleInteraction = () => {
    if (hasTrackedInteraction) {
      return;
    }

    setHasTrackedInteraction(true);
    trackPremiumPrClick({
      itemId,
      itemSlug,
      feature,
      placement: "video_card",
      targetUrl: url,
    });
  };

  return (
    <article
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
      onPointerDownCapture={handleInteraction}
      onFocusCapture={handleInteraction}
    >
      <div className="flex items-start gap-3 border-b border-gray-100 px-4 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#161d1f] text-white">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-black text-gray-950">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-500">
            {description}
          </p>
        </div>
      </div>
      <div className="aspect-video bg-black">
        <iframe
          src={url}
          title={title}
          className="h-full w-full border-0"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </article>
  );
}

export function PremiumPrHeroBadge({
  premiumPr,
  stayTitle,
  itemId,
  itemSlug,
}: PremiumPrProps) {
  const [modal, setModal] = useState<ModalState>(null);
  const normalizedPremiumPr = useMemo(
    () => normalizePremiumPr(premiumPr),
    [premiumPr]
  );
  const media = getPremiumPrMedia(normalizedPremiumPr);

  if (!media.matterportUrl) {
    return null;
  }

  const label = normalizedPremiumPr.display.badgeLabel || "3D 숙소 투어";

  const handleOpen = () => {
    trackPremiumPrClick({
      itemId,
      itemSlug,
      feature: "matterport",
      placement: "hero_badge",
      targetUrl: media.matterportUrl as string,
    });
    setModal({
      title: `${stayTitle} ${label}`,
      url: media.matterportUrl as string,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="absolute bottom-4 right-4 z-10 inline-flex min-h-11 items-center gap-2 rounded-full bg-black/85 px-4 py-2.5 text-sm font-black text-white shadow-lg backdrop-blur transition-transform hover:scale-[1.02] hover:bg-black"
      >
        <Box className="h-4 w-4" />
        {label}
      </button>
      <PremiumPrModal
        title={modal?.title ?? ""}
        url={modal?.url ?? null}
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
      />
    </>
  );
}

export function PremiumPrSection({
  premiumPr,
  stayTitle,
  itemId,
  itemSlug,
}: PremiumPrProps) {
  const [modal, setModal] = useState<ModalState>(null);
  const normalizedPremiumPr = useMemo(
    () => normalizePremiumPr(premiumPr),
    [premiumPr]
  );
  const media = getPremiumPrMedia(normalizedPremiumPr);

  if (!hasAnyPremiumMedia(media)) {
    return null;
  }

  const label = normalizedPremiumPr.display.badgeLabel || "3D 숙소 투어";

  const handleMatterportOpen = () => {
    if (!media.matterportUrl) {
      return;
    }

    trackPremiumPrClick({
      itemId,
      itemSlug,
      feature: "matterport",
      placement: "section_button",
      targetUrl: media.matterportUrl,
    });
    setModal({
      title: `${stayTitle} ${label}`,
      url: media.matterportUrl,
    });
  };

  return (
    <section className="rounded-3xl border border-[#eadfd9] bg-[#fffaf6] p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ae2f34] text-white">
          <BadgeCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ae2f34]">
            Premium PR
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-gray-950">
            미리 둘러보는 숙소 이야기
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            현장에서 보기 전 숙소의 공간감과 호스트 이야기를 영상으로
            확인할 수 있습니다.
          </p>
        </div>
      </div>

      {media.matterportUrl && (
        <button
          type="button"
          onClick={handleMatterportOpen}
          className="mb-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#161d1f] px-4 py-3 text-sm font-black text-white transition-colors hover:bg-[#ae2f34] sm:w-auto"
        >
          <Box className="h-4 w-4" />
          {label}
        </button>
      )}

      <div className="grid grid-cols-1 gap-5">
        {media.hostVideoUrl && (
          <PremiumVideoEmbed
            title="호스트가 전하는 이야기"
            description="숙소를 운영하는 사람이 직접 전하는 공간과 마을의 이야기를 확인해 보세요."
            url={media.hostVideoUrl}
            feature="host_video"
            itemId={itemId}
            itemSlug={itemSlug}
            icon={<Video className="h-5 w-5" />}
          />
        )}
        {media.droneViewUrl && (
          <PremiumVideoEmbed
            title="하늘에서 보는 소원 숙소"
            description="드론 영상으로 숙소 주변의 바다, 마을, 접근 동선을 미리 둘러보세요."
            url={media.droneViewUrl}
            feature="drone_video"
            itemId={itemId}
            itemSlug={itemSlug}
            icon={<Plane className="h-5 w-5" />}
          />
        )}
      </div>

      {(media.hostVideoUrl || media.droneViewUrl) && (
        <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          <PlayCircle className="h-3.5 w-3.5" />
          영상은 현장 이해를 돕기 위한 미리보기 콘텐츠입니다.
        </p>
      )}

      <PremiumPrModal
        title={modal?.title ?? ""}
        url={modal?.url ?? null}
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
      />
    </section>
  );
}
