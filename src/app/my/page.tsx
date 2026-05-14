import type { Metadata } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCircleCheck,
  faClock,
  faHeart,
  faMessage,
  faRoute,
  faTicket,
  faUser,
} from "@/lib/fontawesome";
import { getServerTranslationLocale } from "@/lib/server-translation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "마이페이지 | LocalTrip AX",
  description: "관광객용 마이페이지 placeholder입니다. 운영자 관리자 페이지와 분리됩니다.",
};

type MyCopy = {
  eyebrow: string;
  title: string;
  description: string;
  status: string;
  separationTitle: string;
  separationDesc: string;
  primaryCta: string;
  secondaryCta: string;
  sections: {
    title: string;
    body: string;
    status: string;
    href?: string;
    action?: string;
  }[];
  guideTitle: string;
  guideItems: string[];
};

const MY_COPY: Record<"ko" | "en" | "zh-cn" | "ja-jp", MyCopy> = {
  ko: {
    eyebrow: "관광객용 마이",
    title: "나의 소원로컬트립",
    description:
      "이 공간은 관광객을 위한 개인 대시보드입니다. 현재는 회원가입 없이 안전하게 볼 수 있는 준비 화면이며, 운영자 관리자 페이지와 분리되어 있습니다.",
    status: "게스트 모드",
    separationTitle: "운영자 페이지와 분리됨",
    separationDesc:
      "숙소·체험 운영자가 콘텐츠를 관리하는 관리자 화면은 /admin에 유지됩니다. 공개 네비게이션의 마이는 앞으로 관광객 전용 /my로 연결됩니다.",
    primaryCta: "추천 코스 보기",
    secondaryCta: "찜한 콘텐츠 둘러보기",
    sections: [
      {
        title: "맞춤코스",
        body: "숙박, 체험, 주민소득상품을 직접 조합하는 기능을 localStorage 기반으로 사용할 수 있습니다.",
        status: "사용 가능",
        href: "/course-builder",
        action: "맞춤코스 만들기",
      },
      {
        title: "찜 목록",
        body: "현재 찜 기능은 브라우저에 저장됩니다. 이후 이 화면에서 찜한 숙소, 체험, 별미, 코스를 모아볼 수 있게 연결합니다.",
        status: "연결 준비 중",
      },
      {
        title: "문의 내역",
        body: "MVP에서는 문의 제출 후 운영자가 입력한 연락처로 안내합니다. 계정 기반 문의 이력은 관광객 인증 설계 이후 연결합니다.",
        status: "문의 기반 안내",
        href: "/customer-center",
        action: "고객센터 보기",
      },
      {
        title: "예약현황",
        body: "LocalTrip AX MVP는 실시간 예약 확정 플랫폼이 아닙니다. 운영 가능 여부는 전화, 카카오, 네이버예약, 문의폼으로 확인합니다.",
        status: "예약 확정 제외",
      },
      {
        title: "결제내역",
        body: "결제와 정산은 MVP 범위에서 제외되어 있습니다. 결제내역은 실제 결제 정책이 확정된 뒤 별도 티켓에서 다룹니다.",
        status: "MVP 제외",
      },
      {
        title: "알림",
        body: "문의 접수, 맞춤코스 저장, 이벤트 혜택 알림은 후속 알림 센터 설계 후 단계적으로 연결합니다.",
        status: "T-087 설계",
      },
    ],
    guideTitle: "현재 단계에서 가능한 일",
    guideItems: [
      "공개 콘텐츠를 둘러보고 찜할 수 있습니다.",
      "상세 페이지에서 전화, 카카오, 네이버예약, 문의폼으로 연결할 수 있습니다.",
      "예약 확정, 결제, 정산, 실시간 재고 확인은 아직 제공하지 않습니다.",
    ],
  },
  en: {
    eyebrow: "Traveler My Page",
    title: "My Sowon Local Trip",
    description:
      "This is a traveler-facing dashboard placeholder. It is safe to view without sign-up and is separated from the operator admin dashboard.",
    status: "Guest mode",
    separationTitle: "Separated from the operator admin",
    separationDesc:
      "The admin area for managing stays, activities, and local programs remains under /admin. The public My button now leads to the traveler-only /my route.",
    primaryCta: "View itineraries",
    secondaryCta: "Browse saved items",
    sections: [
      {
        title: "Custom Itineraries",
        body: "Use a localStorage-based builder to combine stays, activities, and resident-run local products.",
        status: "Available now",
        href: "/course-builder",
        action: "Build a trip",
      },
      {
        title: "Wishlist",
        body: "Wishlist items are currently stored in your browser. This page will later collect saved stays, activities, local foods, and courses.",
        status: "Preparing link",
      },
      {
        title: "Inquiries",
        body: "For the MVP, operators respond using the contact details you submit. Account-based inquiry history will come after traveler auth design.",
        status: "Inquiry-based",
        href: "/customer-center",
        action: "Open support",
      },
      {
        title: "Reservation Status",
        body: "LocalTrip AX MVP is not a real-time booking confirmation platform. Availability is checked through phone, Kakao, Naver Booking, or inquiry forms.",
        status: "No confirmed booking",
      },
      {
        title: "Payments",
        body: "Payments and settlement are outside the MVP scope. Payment history will be handled after the payment policy is finalized.",
        status: "Out of MVP",
      },
      {
        title: "Notifications",
        body: "Inquiry receipts, saved trip plans, and event benefit notifications will be connected after the notification center design.",
        status: "T-087 design",
      },
    ],
    guideTitle: "Available for now",
    guideItems: [
      "Browse and save public content.",
      "Use phone, Kakao, Naver Booking, or inquiry forms from detail pages.",
      "Confirmed booking, payment, settlement, and live inventory are not provided yet.",
    ],
  },
  "zh-cn": {
    eyebrow: "游客个人中心",
    title: "我的所愿本地游",
    description:
      "这是面向游客的个人中心占位页面。当前无需注册即可安全查看，并已与运营方管理后台分离。",
    status: "访客模式",
    separationTitle: "已与运营后台分离",
    separationDesc:
      "用于管理住宿、体验和居民所得商品的后台仍保留在 /admin。公开导航中的“我的”现在连接到游客专用的 /my。",
    primaryCta: "查看推荐路线",
    secondaryCta: "查看收藏内容",
    sections: [
      {
        title: "定制路线",
        body: "可以使用基于 localStorage 的工具，自由组合住宿、体验和居民运营的本地商品。",
        status: "可使用",
        href: "/course-builder",
        action: "创建路线",
      },
      {
        title: "收藏列表",
        body: "当前收藏内容保存在浏览器中。之后将在此页面汇总收藏的住宿、体验、本地美食和路线。",
        status: "连接准备中",
      },
      {
        title: "咨询记录",
        body: "MVP 阶段提交咨询后，运营方会通过您填写的联系方式回复。账号型咨询记录将在游客认证设计后连接。",
        status: "咨询基础",
        href: "/customer-center",
        action: "打开客服中心",
      },
      {
        title: "预约状态",
        body: "LocalTrip AX MVP 不是实时预约确认平台。可通过电话、Kakao、Naver 预约或咨询表单确认可用情况。",
        status: "不含预约确认",
      },
      {
        title: "支付记录",
        body: "支付与结算不在 MVP 范围内。支付记录将在支付政策确定后作为独立功能处理。",
        status: "MVP 范围外",
      },
      {
        title: "通知",
        body: "咨询接收、定制路线保存、活动优惠通知将在通知中心设计后逐步连接。",
        status: "T-087 设计",
      },
    ],
    guideTitle: "当前可使用",
    guideItems: [
      "浏览并收藏公开内容。",
      "在详情页通过电话、Kakao、Naver 预约或咨询表单联系。",
      "暂不提供预约确认、支付、结算和实时库存。",
    ],
  },
  "ja-jp": {
    eyebrow: "旅行者向けマイページ",
    title: "私のソウォン・ローカルトリップ",
    description:
      "旅行者向けのマイページ placeholder です。現在は登録なしで安全に表示でき、運営者用の管理画面とは分離されています。",
    status: "ゲストモード",
    separationTitle: "運営者管理画面と分離済み",
    separationDesc:
      "宿泊・体験・住民所得商品の管理画面は /admin に維持されます。公開ナビのマイは旅行者専用の /my に接続されます。",
    primaryCta: "おすすめコースを見る",
    secondaryCta: "保存した内容を見る",
    sections: [
      {
        title: "カスタムコース",
        body: "localStorage ベースのビルダーで、宿泊、体験、住民運営のローカル商品を組み合わせられます。",
        status: "利用可能",
        href: "/course-builder",
        action: "コースを作る",
      },
      {
        title: "お気に入り",
        body: "現在のお気に入りはブラウザに保存されます。今後この画面で宿泊、体験、ローカルフード、コースをまとめて確認できるようにします。",
        status: "連携準備中",
      },
      {
        title: "お問い合わせ履歴",
        body: "MVP ではお問い合わせ送信後、運営者が入力された連絡先へ案内します。アカウント型の履歴は旅行者認証設計後に接続します。",
        status: "お問い合わせベース",
        href: "/customer-center",
        action: "サポートを見る",
      },
      {
        title: "予約状況",
        body: "LocalTrip AX MVP はリアルタイム予約確定プラットフォームではありません。電話、Kakao、Naver 予約、お問い合わせフォームで確認します。",
        status: "予約確定なし",
      },
      {
        title: "決済履歴",
        body: "決済と精算は MVP 範囲外です。決済履歴は決済方針が確定した後、別チケットで扱います。",
        status: "MVP 対象外",
      },
      {
        title: "通知",
        body: "お問い合わせ受付、カスタムコース保存、イベント特典通知は通知センター設計後に段階的に接続します。",
        status: "T-087 設計",
      },
    ],
    guideTitle: "現在できること",
    guideItems: [
      "公開コンテンツを閲覧し、お気に入りに保存できます。",
      "詳細ページから電話、Kakao、Naver 予約、お問い合わせフォームで接続できます。",
      "予約確定、決済、精算、リアルタイム在庫確認はまだ提供していません。",
    ],
  },
};

const icons = [faRoute, faHeart, faMessage, faCalendarDays, faTicket, faClock];

export default async function MyPage() {
  const currentLocale = await getServerTranslationLocale();
  const t = MY_COPY[currentLocale] ?? MY_COPY.ko;

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-28">
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-black text-[#ae2f34] shadow-sm">
              <FontAwesomeIcon icon={faUser} className="h-3.5 w-3.5" />
              {t.eyebrow}
            </span>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-gray-950 sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-gray-600">
              {t.description}
            </p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-[#111827] p-5 text-white shadow-xl lg:w-[320px]">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <FontAwesomeIcon icon={faCircleCheck} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/55">{t.status}</p>
                <p className="text-sm font-black">{t.separationTitle}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/70">{t.separationDesc}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/course-builder"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#ae2f34] px-5 text-sm font-black text-white shadow-sm transition hover:bg-[#93272b]"
          >
            {t.primaryCta}
          </Link>
          <Link
            href="/stays"
            className="inline-flex h-12 items-center justify-center rounded-full border border-gray-200 bg-white px-5 text-sm font-black text-gray-800 shadow-sm transition hover:border-gray-300"
          >
            {t.secondaryCta}
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {t.sections.map((section, index) => (
            <article key={section.title} className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-gray-800">
                  <FontAwesomeIcon icon={icons[index]} className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-gray-50 px-3 py-1 text-[11px] font-black text-gray-500 ring-1 ring-gray-100">
                  {section.status}
                </span>
              </div>
              <h2 className="mt-5 text-lg font-black tracking-tight text-gray-950">{section.title}</h2>
              <p className="mt-2 min-h-[72px] text-sm font-medium leading-6 text-gray-600">{section.body}</p>
              {section.href && section.action ? (
                <Link
                  href={section.href}
                  className="mt-5 inline-flex text-sm font-black text-[#ae2f34] transition hover:text-[#7f1f23]"
                >
                  {section.action}
                </Link>
              ) : null}
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black tracking-tight text-gray-950">{t.guideTitle}</h2>
          <ul className="mt-4 grid gap-3 text-sm font-medium leading-6 text-gray-600 md:grid-cols-3">
            {t.guideItems.map((item) => (
              <li key={item} className="flex gap-3">
                <FontAwesomeIcon icon={faCircleCheck} className="mt-1 h-4 w-4 shrink-0 text-[#ae2f34]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
