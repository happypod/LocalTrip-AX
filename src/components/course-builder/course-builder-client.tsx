"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faBed,
  faCircleCheck,
  faFloppyDisk,
  faMessage,
  faPersonHiking,
  faPlus,
  faRoute,
  faStore,
  faTrash,
  faTriangleExclamation,
} from "@/lib/fontawesome";
import { ContentImage } from "@/components/common/content-image";
import type {
  CourseBuilderData,
  CourseBuilderItemType,
  CourseBuilderOption,
} from "@/lib/course-builder-data";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "ltax_custom_trip_plan_v1";

type BuilderTab = "all" | CourseBuilderItemType;

type SavedPlan = {
  version: 1;
  updatedAt: string;
  note: string;
  items: CourseBuilderOption[];
};

type BuilderCopy = {
  badge: string;
  title: string;
  desc: string;
  noBooking: string;
  all: string;
  stays: string;
  experiences: string;
  programs: string;
  add: string;
  added: string;
  detail: string;
  planTitle: string;
  planEmpty: string;
  noteLabel: string;
  notePlaceholder: string;
  save: string;
  saved: string;
  clear: string;
  inquiry: string;
  myPage: string;
  remove: string;
  moveUp: string;
  moveDown: string;
  total: string;
  stayLabel: string;
  experienceLabel: string;
  programLabel: string;
  optionEmptyTitle: string;
  optionEmptyDesc: string;
  dbErrorMsg: string;
};

const COPY: Record<string, BuilderCopy> = {
  ko: {
    badge: "게스트 맞춤코스",
    title: "나만의 소원 코스 만들기",
    desc: "숙박, 체험, 주민소득상품을 직접 골라 임시 여정을 구성합니다. 저장 내용은 이 브라우저에만 남습니다.",
    noBooking: "예약 확정, 결제, 재고 확인 기능은 포함하지 않습니다. 실제 이용 가능 여부는 문의로 확인합니다.",
    all: "전체",
    stays: "숙박",
    experiences: "체험",
    programs: "별미/주민소득상품",
    add: "추가",
    added: "추가됨",
    detail: "상세보기",
    planTitle: "내 임시 코스",
    planEmpty: "왼쪽 콘텐츠를 추가하면 여정 순서를 만들 수 있습니다.",
    noteLabel: "여정 메모",
    notePlaceholder: "동행자, 이동 방식, 희망 시간 등 운영자에게 전달할 메모를 적어보세요.",
    save: "브라우저에 저장",
    saved: "저장됨",
    clear: "비우기",
    inquiry: "문의로 연결",
    myPage: "마이페이지",
    remove: "삭제",
    moveUp: "위로",
    moveDown: "아래로",
    total: "선택",
    stayLabel: "숙박",
    experienceLabel: "체험",
    programLabel: "주민소득상품",
    optionEmptyTitle: "선택 가능한 콘텐츠가 없습니다",
    optionEmptyDesc: "현재 소원권역의 등록된 콘텐츠를 불러올 수 없거나 준비 중입니다.",
    dbErrorMsg: "콘텐츠를 불러오지 못했습니다. 데이터베이스 연결 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  },
  en: {
    badge: "Guest Trip Builder",
    title: "Build Your Sowon Trip",
    desc: "Combine stays, activities, and local products into a temporary trip plan. It is saved only in this browser.",
    noBooking: "This does not confirm bookings, payments, or live availability. Please check availability by inquiry.",
    all: "All",
    stays: "Stays",
    experiences: "Activities",
    programs: "Local taste",
    add: "Add",
    added: "Added",
    detail: "View details",
    planTitle: "My Draft Trip",
    planEmpty: "Add content from the left to start arranging your route.",
    noteLabel: "Trip note",
    notePlaceholder: "Add companions, transport preferences, preferred times, or questions for the operator.",
    save: "Save in browser",
    saved: "Saved",
    clear: "Clear",
    inquiry: "Send inquiry",
    myPage: "My page",
    remove: "Remove",
    moveUp: "Move up",
    moveDown: "Move down",
    total: "selected",
    stayLabel: "Stay",
    experienceLabel: "Activity",
    programLabel: "Local product",
    optionEmptyTitle: "No selectable contents available",
    optionEmptyDesc: "Currently there are no registered items or we failed to load them.",
    dbErrorMsg: "We could not load content options. A database error occurred. Please try again shortly.",
  },
  "zh-cn": {
    badge: "游客行程草稿",
    title: "创建我的所愿行程",
    desc: "自由组合住宿、体验活动和本地特产。内容仅临时保存在当前浏览器中。",
    noBooking: "此功能不代表预约确认、付款或实时库存确认。实际可用情况请通过咨询确认。",
    all: "全部",
    stays: "住宿",
    experiences: "体验",
    programs: "本地风味",
    add: "添加",
    added: "已添加",
    detail: "查看详情",
    planTitle: "我的临时行程",
    planEmpty: "从左侧添加内容后即可调整行程顺序。",
    noteLabel: "行程备注",
    notePlaceholder: "可填写同行人数、交通方式、希望时间或想咨询的问题。",
    save: "保存到浏览器",
    saved: "已保存",
    clear: "清空",
    inquiry: "前往咨询",
    myPage: "我的页面",
    remove: "删除",
    moveUp: "上移",
    moveDown: "下移",
    total: "已选",
    stayLabel: "住宿",
    experienceLabel: "体验",
    programLabel: "本地产品",
    optionEmptyTitle: "暂无可选择的内容",
    optionEmptyDesc: "当前所愿地区暂无已注册内容，或无法正常加载。",
    dbErrorMsg: "内容加载失败，数据库连接发生错误。请稍后再试。",
  },
  "ja-jp": {
    badge: "ゲスト用コース作成",
    title: "自分だけのソウォン旅を作る",
    desc: "宿泊、体験、地元商品を自由に組み合わせて、仮の旅程を作成できます。保存先はこのブラウザのみです。",
    noBooking: "予約確定、決済、空き状況のリアルタイム確認ではありません。利用可否はお問い合わせでご確認ください。",
    all: "すべて",
    stays: "宿泊",
    experiences: "体験",
    programs: "ローカルの味",
    add: "追加",
    added: "追加済み",
    detail: "詳細を見る",
    planTitle: "仮のマイコース",
    planEmpty: "左のコンテンツを追加すると、旅程の順番を作成できます。",
    noteLabel: "旅程メモ",
    notePlaceholder: "同行者、移動方法、希望時間、運営者に伝えたい内容を入力してください。",
    save: "ブラウザに保存",
    saved: "保存済み",
    clear: "クリア",
    inquiry: "問い合わせへ",
    myPage: "マイページ",
    remove: "削除",
    moveUp: "上へ",
    moveDown: "下へ",
    total: "選択",
    stayLabel: "宿泊",
    experienceLabel: "体験",
    programLabel: "地元商品",
    optionEmptyTitle: "選択可能なコンテンツがありません",
    optionEmptyDesc: "現在、ソウォン圏域に登録されたコンテンツがないか、読み込めません。",
    dbErrorMsg: "コンテンツを読み込めませんでした。データベース接続エラーが発生しました。しばらくしてから再試行してください。",
  },
};

const ITEM_META: Record<
  CourseBuilderItemType,
  { color: string; icon: typeof faBed; labelKey: keyof BuilderCopy }
> = {
  accommodation: {
    color: "bg-category-stay text-white",
    icon: faBed,
    labelKey: "stayLabel",
  },
  experience: {
    color: "bg-category-experience text-white",
    icon: faPersonHiking,
    labelKey: "experienceLabel",
  },
  local_income_program: {
    color: "bg-category-program text-white",
    icon: faStore,
    labelKey: "programLabel",
  },
};

function optionKey(item: Pick<CourseBuilderOption, "itemType" | "id">) {
  return `${item.itemType}:${item.id}`;
}

function loadSavedPlan(): SavedPlan | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<SavedPlan>;
    if (!Array.isArray(parsed.items)) {
      return null;
    }

    return {
      version: 1,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
      note: typeof parsed.note === "string" ? parsed.note : "",
      items: parsed.items.filter(
        (item): item is CourseBuilderOption =>
          typeof item?.id === "string" &&
          typeof item.slug === "string" &&
          typeof item.title === "string" &&
          typeof item.summary === "string" &&
          (item.itemType === "accommodation" ||
            item.itemType === "experience" ||
            item.itemType === "local_income_program"),
      ),
    };
  } catch {
    return null;
  }
}

interface CourseBuilderClientProps {
  data: CourseBuilderData;
  locale: string;
}

export function CourseBuilderClient({ data, locale }: CourseBuilderClientProps) {
  const copy = COPY[locale] ?? COPY.ko;
  const [activeTab, setActiveTab] = useState<BuilderTab>("all");
  const [items, setItems] = useState<CourseBuilderOption[]>([]);
  const [note, setNote] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const allOptions = useMemo(
    () => [...data.stays, ...data.experiences, ...data.programs],
    [data],
  );

  const selectedKeys = useMemo(() => new Set(items.map(optionKey)), [items]);

  const filteredOptions = useMemo(() => {
    if (activeTab === "all") {
      return allOptions;
    }
    return allOptions.filter((item) => item.itemType === activeTab);
  }, [activeTab, allOptions]);

  useEffect(() => {
    window.queueMicrotask(() => {
      const saved = loadSavedPlan();
      if (saved) {
        setItems(saved.items);
        setNote(saved.note);
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const payload: SavedPlan = {
      version: 1,
      updatedAt: new Date().toISOString(),
      note,
      items,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [hydrated, items, note]);

  function addItem(item: CourseBuilderOption) {
    if (selectedKeys.has(optionKey(item))) {
      return;
    }
    setItems((current) => [...current, item]);
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
  }

  function savePlan() {
    const payload: SavedPlan = {
      version: 1,
      updatedAt: new Date().toISOString(),
      note,
      items,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1400);
  }

  function clearPlan() {
    setItems([]);
    setNote("");
    window.localStorage.removeItem(STORAGE_KEY);
  }

  const counts = {
    accommodation: items.filter((item) => item.itemType === "accommodation").length,
    experience: items.filter((item) => item.itemType === "experience").length,
    local_income_program: items.filter((item) => item.itemType === "local_income_program").length,
  };

  const tabs: { value: BuilderTab; label: string }[] = [
    { value: "all", label: copy.all },
    { value: "accommodation", label: copy.stays },
    { value: "experience", label: copy.experiences },
    { value: "local_income_program", label: copy.programs },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-28">
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_360px] lg:items-end lg:py-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-black text-[#6d58c8] shadow-sm">
              <FontAwesomeIcon icon={faRoute} className="h-3.5 w-3.5" />
              {copy.badge}
            </span>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-gray-950 sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-gray-600">
              {copy.desc}
            </p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5 text-sm font-bold leading-6 text-violet-950">
            <FontAwesomeIcon icon={faCircleCheck} className="mr-2 h-4 w-4 text-[#6d58c8]" />
            {copy.noBooking}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        {data.source === "error" && (
          <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold leading-6 text-red-800 flex items-start gap-3">
            <FontAwesomeIcon icon={faTriangleExclamation} className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <span>{copy.dbErrorMsg}</span>
          </div>
        )}
        <div className="min-w-0">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "h-11 shrink-0 rounded-full border px-4 text-sm font-black transition",
                  activeTab === tab.value
                    ? "border-[#6d58c8] bg-[#6d58c8] text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredOptions.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-16 text-center shadow-sm">
                <FontAwesomeIcon icon={faRoute} className="mb-4 h-10 w-10 text-gray-300" />
                <h3 className="text-lg font-black text-gray-950">{copy.optionEmptyTitle}</h3>
                <p className="mt-2 max-w-md px-6 text-sm font-medium text-gray-500 leading-6">
                  {copy.optionEmptyDesc}
                </p>
              </div>
            ) : (
              filteredOptions.map((option) => {
                const meta = ITEM_META[option.itemType];
                const selected = selectedKeys.has(optionKey(option));

                return (
                  <article
                    key={optionKey(option)}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                  >
                    <ContentImage
                      src={option.imageUrl}
                      alt={option.title}
                      containerClassName="h-40 w-full"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      fallback={
                        <div className="flex h-40 w-full items-center justify-center bg-gray-100 text-xs font-black text-gray-400">
                          IMAGE
                        </div>
                      }
                    />
                    <div className="p-4">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black", meta.color)}>
                        <FontAwesomeIcon icon={meta.icon} className="h-3 w-3" />
                        {copy[meta.labelKey]}
                      </span>
                      <h2 className="mt-3 line-clamp-2 text-base font-black leading-snug text-gray-950">
                        {option.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 min-h-[44px] text-sm font-medium leading-6 text-gray-600">
                        {option.summary}
                      </p>
                      <div className="mt-3 min-h-[20px] text-xs font-bold text-gray-500">
                        {[option.meta, option.priceText].filter(Boolean).join(" · ")}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          disabled={selected}
                          onClick={() => addItem(option)}
                          className={cn(
                            "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-sm font-black transition",
                            selected
                              ? "bg-gray-100 text-gray-400"
                              : "bg-gray-950 text-white hover:bg-gray-800",
                          )}
                        >
                          <FontAwesomeIcon icon={selected ? faCircleCheck : faPlus} className="h-3.5 w-3.5" />
                          {selected ? copy.added : copy.add}
                        </button>
                        <Link
                          href={option.href}
                          className="inline-flex h-11 items-center justify-center rounded-full border border-gray-200 bg-white px-4 text-xs font-black text-gray-700 hover:border-gray-300"
                        >
                          {copy.detail}
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-5 lg:self-start">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-[#6d58c8]">
                  {items.length} {copy.total}
                </p>
                <h2 className="mt-1 text-xl font-black text-gray-950">{copy.planTitle}</h2>
              </div>
              <FontAwesomeIcon icon={faRoute} className="mt-1 h-5 w-5 text-[#6d58c8]" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-black">
              <div className="rounded-xl bg-blue-50 px-2 py-2 text-blue-700">
                {copy.stayLabel} {counts.accommodation}
              </div>
              <div className="rounded-xl bg-green-50 px-2 py-2 text-green-700">
                {copy.experienceLabel} {counts.experience}
              </div>
              <div className="rounded-xl bg-orange-50 px-2 py-2 text-orange-700">
                {copy.programLabel} {counts.local_income_program}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm font-bold leading-6 text-gray-500">
                  {copy.planEmpty}
                </div>
              ) : (
                items.map((item, index) => {
                  const meta = ITEM_META[item.itemType];
                  return (
                    <div key={`${optionKey(item)}:${index}`} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                      <div className="flex gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-gray-500 shadow-sm">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-black text-gray-950">{item.title}</p>
                          <p className="mt-1 text-xs font-bold text-gray-500">{copy[meta.labelKey]}</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => moveItem(index, -1)}
                          disabled={index === 0}
                          className="h-9 rounded-full bg-white text-xs font-black text-gray-600 disabled:text-gray-300"
                          aria-label={copy.moveUp}
                        >
                          <FontAwesomeIcon icon={faArrowUp} className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(index, 1)}
                          disabled={index === items.length - 1}
                          className="h-9 rounded-full bg-white text-xs font-black text-gray-600 disabled:text-gray-300"
                          aria-label={copy.moveDown}
                        >
                          <FontAwesomeIcon icon={faArrowDown} className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="h-9 rounded-full bg-white text-xs font-black text-red-500"
                          aria-label={copy.remove}
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <label className="mt-5 block text-sm font-black text-gray-800" htmlFor="trip-note">
              {copy.noteLabel}
            </label>
            <textarea
              id="trip-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={copy.notePlaceholder}
              className="mt-2 min-h-28 w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium leading-6 text-gray-800 outline-none transition focus:border-[#6d58c8] focus:ring-4 focus:ring-violet-100"
            />

            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={savePlan}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#6d58c8] px-4 text-sm font-black text-white shadow-sm transition hover:bg-[#5b48ad]"
              >
                <FontAwesomeIcon icon={faFloppyDisk} className="h-4 w-4" />
                {savedFlash ? copy.saved : copy.save}
              </button>
              <Link
                href="/customer-center"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gray-950 px-4 text-sm font-black text-white transition hover:bg-gray-800"
              >
                <FontAwesomeIcon icon={faMessage} className="h-4 w-4" />
                {copy.inquiry}
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/my"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-gray-200 bg-white px-4 text-xs font-black text-gray-700 hover:border-gray-300"
                >
                  {copy.myPage}
                </Link>
                <button
                  type="button"
                  onClick={clearPlan}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-gray-200 bg-white px-4 text-xs font-black text-gray-700 hover:border-gray-300"
                >
                  {copy.clear}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
