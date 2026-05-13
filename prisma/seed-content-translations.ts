import "dotenv/config";

import { Prisma } from "@prisma/client";
import { getPrisma } from "../src/lib/prisma";
import {
  CONTENT_TRANSLATION_LOCALES,
  ContentTranslationLocale,
  ContentTranslationTargetType,
} from "../src/lib/content-translation";

type TranslationPayload = {
  title: string;
  summary?: string;
  description?: string;
  metadata?: Record<string, string>;
};

type TranslationEntry = {
  targetType: ContentTranslationTargetType;
  selector: {
    slug?: string;
    title?: string;
  };
  translations: Record<ContentTranslationLocale, TranslationPayload>;
};

const translations: TranslationEntry[] = [
  {
    targetType: "accommodation",
    selector: { slug: "sowon-house-01" },
    translations: {
      en: {
        title: "Sowon Sunset Pension",
        summary: "A sea-view pension overlooking Mallipo's sunset and the western coast.",
        description:
          "A comfortable seaside pension where guests can enjoy the western sea from the living room. It is well suited for families and small groups looking for a quiet stay near the coast.",
        metadata: {
          address: "123 Mallipo Beach Road, Sowon-myeon, Taean-gun, Chungcheongnam-do",
          capacityText: "Standard 2 guests / Maximum 4 guests",
          priceText: "Weekdays from KRW 120,000",
        },
      },
      "zh-cn": {
        title: "所愿落日晚霞民宿",
        summary: "可眺望万里浦落日与西海岸风景的海景民宿。",
        description:
          "这是一处安静舒适的海边民宿，客人可在客厅欣赏西海岸风光。适合家庭或小团体在海边度过放松的停留时光。",
        metadata: {
          address: "忠清南道泰安郡所愿面万里浦海边路123",
          capacityText: "标准2人 / 最多4人",
          priceText: "平日120,000韩元起",
        },
      },
      "ja-jp": {
        title: "ソウォン夕景ペンション",
        summary: "万里浦の夕日と西海を望む、海辺のペンション。",
        description:
          "リビングから西海の景色を楽しめる、静かな海辺の宿です。家族旅行や少人数の滞在に向いた、落ち着いた空間を備えています。",
        metadata: {
          address: "忠清南道泰安郡所願面万里浦海辺路123",
          capacityText: "基本2名 / 最大4名",
          priceText: "平日120,000ウォンから",
        },
      },
    },
  },
  {
    targetType: "accommodation",
    selector: { slug: "cheonripo-minbak" },
    translations: {
      en: {
        title: "Cheonripo Harbor Guesthouse",
        summary: "A modest fishing-village guesthouse where you can feel the calm rhythm of the harbor.",
        description:
          "Located near Cheonripo Beach, this quiet guesthouse offers a simple local stay with warm hospitality and an easygoing fishing-village atmosphere.",
        metadata: {
          address: "45 Cheonripo-gil, Sowon-myeon, Taean-gun, Chungcheongnam-do",
          capacityText: "Standard 1 guest / Maximum 2 guests",
          priceText: "KRW 50,000",
        },
      },
      "zh-cn": {
        title: "千里浦渔村民宿",
        summary: "可感受安静渔港节奏的朴素渔村民宿。",
        description:
          "民宿位于千里浦海边附近，提供朴实温暖的本地住宿体验，适合想静静感受渔村日常的旅客。",
        metadata: {
          address: "忠清南道泰安郡所愿面千里浦路45",
          capacityText: "标准1人 / 最多2人",
          priceText: "50,000韩元",
        },
      },
      "ja-jp": {
        title: "千里浦漁村民泊",
        summary: "静かな港町の空気を感じられる、素朴な漁村民泊。",
        description:
          "千里浦海岸の近くにある静かな民泊です。飾らない地元のもてなしと、漁村らしいゆったりした時間を楽しめます。",
        metadata: {
          address: "忠清南道泰安郡所願面千里浦路45",
          capacityText: "基本1名 / 最大2名",
          priceText: "50,000ウォン",
        },
      },
    },
  },
  {
    targetType: "accommodation",
    selector: { slug: "uihang-hanok-stay" },
    translations: {
      en: {
        title: "Uihang Hanok Stay",
        summary: "A quiet hanok-style stay close to pine trees and a sea trail.",
        description:
          "A calm hanok-inspired stay near Uihang Port and the coastal walking trail. The small yard and ondol-style room make it suitable for families or travelers seeking a restful night.",
        metadata: {
          address: "78 Uihang-ri Road, Sowon-myeon, Taean-gun, Chungcheongnam-do",
          capacityText: "Standard 2 guests / Maximum 4 guests",
          priceText: "Weekdays from KRW 90,000",
        },
      },
      "zh-cn": {
        title: "蚁项韩屋住宿",
        summary: "靠近松林与海岸步道的安静韩屋风住宿。",
        description:
          "位于蚁项港和海岸步道附近的韩屋风住宿。小院与暖炕式房间营造安静氛围，适合家庭或想好好休息的旅客。",
        metadata: {
          address: "忠清南道泰安郡所愿面蚁项里路78",
          capacityText: "标准2人 / 最多4人",
          priceText: "平日90,000韩元起",
        },
      },
      "ja-jp": {
        title: "蟻項韓屋ステイ",
        summary: "松林と海辺の散策路に近い、静かな韓屋風の宿。",
        description:
          "蟻項港と海辺の散策路の近くにある、落ち着いた韓屋風の宿です。小さな庭とオンドルの部屋があり、家族旅行や静かな休息に向いています。",
        metadata: {
          address: "忠清南道泰安郡所願面蟻項里路78",
          capacityText: "基本2名 / 最大4名",
          priceText: "平日90,000ウォンから",
        },
      },
    },
  },
  {
    targetType: "accommodation",
    selector: { slug: "mallipo-glamping" },
    translations: {
      en: {
        title: "Mallipo Seaside Glamping",
        summary: "A casual glamping stay near the sea, made for relaxed coastal nights.",
        description:
          "A glamping stay with easy access to Mallipo Beach. It is a good fit for travelers who want a light outdoor mood with the comfort of a prepared stay.",
        metadata: {
          address: "31 Mallipo-gil, Sowon-myeon, Taean-gun, Chungcheongnam-do",
          capacityText: "Standard 2 guests / Maximum 3 guests",
          priceText: "Weekdays from KRW 110,000",
        },
      },
      "zh-cn": {
        title: "万里浦海边露营住宿",
        summary: "靠近大海、适合轻松海岸夜晚的感性露营住宿。",
        description:
          "这处露营住宿前往万里浦海边十分方便。适合想体验轻户外氛围，同时又希望住宿准备妥当的旅客。",
        metadata: {
          address: "忠清南道泰安郡所愿面万里浦路31",
          capacityText: "标准2人 / 最多3人",
          priceText: "平日110,000韩元起",
        },
      },
      "ja-jp": {
        title: "万里浦シーサイドグランピング",
        summary: "海の近くで気軽に過ごせる、感性派グランピング。",
        description:
          "万里浦海岸へのアクセスが良いグランピング宿です。アウトドア気分を軽く楽しみながら、整った滞在環境で過ごしたい方に向いています。",
        metadata: {
          address: "忠清南道泰安郡所願面万里浦路31",
          capacityText: "基本2名 / 最大3名",
          priceText: "平日110,000ウォンから",
        },
      },
    },
  },
  {
    targetType: "experience",
    selector: { slug: "mallipo-sunset-walk" },
    translations: {
      en: {
        title: "Mallipo Sunset Walk",
        summary: "A gentle guided walk along Mallipo Beach at sunset.",
        description:
          "Walk with a local guide to discover scenic points around Mallipo Beach as the sun sets. It is a relaxed experience for photos, stories, and a quiet moment by the western sea.",
        metadata: {
          address: "Mallipo Beach",
          capacityText: "Up to 10 guests",
          priceText: "KRW 15,000",
        },
      },
      "zh-cn": {
        title: "万里浦落日海岸漫步",
        summary: "在夕阳时分沿万里浦海边散步的轻松导览体验。",
        description:
          "与本地向导一起在万里浦海边寻找适合欣赏落日的地点。适合拍照、聆听地方故事，并在西海边享受安静时光。",
        metadata: {
          address: "万里浦海水浴场",
          capacityText: "最多10人",
          priceText: "15,000韩元",
        },
      },
      "ja-jp": {
        title: "万里浦サンセットウォーク",
        summary: "夕暮れの万里浦海岸をゆっくり歩くガイド付き散策。",
        description:
          "地元ガイドと一緒に、夕日に染まる万里浦海岸の見どころを巡ります。写真撮影や地域の話を聞きながら、西海の静かな時間を楽しめる体験です。",
        metadata: {
          address: "万里浦海水浴場",
          capacityText: "最大10名",
          priceText: "15,000ウォン",
        },
      },
    },
  },
  {
    targetType: "experience",
    selector: { slug: "gamtae-mini-class" },
    translations: {
      en: {
        title: "Gamtae Seaweed Mini Class",
        summary: "A hands-on class to learn, taste, and make simple snacks with Sowon's gamtae seaweed.",
        description:
          "Learn how gamtae is harvested and prepared in the clean coastal environment, then make a simple snack using local seaweed.",
        metadata: {
          address: "Near the Sowon-myeon community center",
          capacityText: "Minimum 4 guests",
          priceText: "KRW 20,000",
        },
      },
      "zh-cn": {
        title: "甘苔海苔迷你课堂",
        summary: "学习所愿甘苔海苔，并亲手制作简单小吃的体验。",
        description:
          "了解在洁净海域生长的甘苔海苔及其生产过程，并使用本地海苔制作简单小吃。",
        metadata: {
          address: "所愿面居民中心附近",
          capacityText: "4人以上",
          priceText: "20,000韩元",
        },
      },
      "ja-jp": {
        title: "カムテ海苔ミニクラス",
        summary: "所願のカムテ海苔を学び、味わい、簡単なおやつを作る体験。",
        description:
          "清らかな海で育つカムテ海苔の生産過程を学び、地元の海苔を使った簡単なおやつ作りを体験します。",
        metadata: {
          address: "所願面住民センター付近",
          capacityText: "4名以上",
          priceText: "20,000ウォン",
        },
      },
    },
  },
  {
    targetType: "experience",
    selector: { slug: "fishing-village-morning-walk" },
    translations: {
      en: {
        title: "Fishing Village Morning Walk",
        summary: "A quiet morning stroll through a harbor village just as the day begins.",
        description:
          "Explore a calm fishing village in the early morning and get a closer look at the everyday rhythm of local coastal life.",
        metadata: {
          address: "Cheonripo fishing village",
          capacityText: "No strict limit",
          priceText: "Free, donation-based",
        },
      },
      "zh-cn": {
        title: "渔村清晨散步",
        summary: "在一天开始时走进安静渔村的清晨漫步。",
        description:
          "清晨漫步于安静的渔村，近距离感受当地海边生活的日常节奏。",
        metadata: {
          address: "千里浦渔村",
          capacityText: "人数不限",
          priceText: "免费，欢迎自愿捐助",
        },
      },
      "ja-jp": {
        title: "漁村の朝さんぽ",
        summary: "一日の始まりに、静かな港町を歩く朝の散策。",
        description:
          "早朝の静かな漁村を巡り、海辺で暮らす人々の日常のリズムを身近に感じる体験です。",
        metadata: {
          address: "千里浦漁村",
          capacityText: "人数制限なし",
          priceText: "無料、寄付制",
        },
      },
    },
  },
  {
    targetType: "experience",
    selector: { slug: "beachcombing-workshop" },
    translations: {
      en: {
        title: "Beachcombing Upcycling Workshop",
        summary: "An eco-friendly craft experience that turns beach finds into small keepsakes.",
        description:
          "Use shells and sea glass collected from the beach to make a personal accessory. This workshop combines coastal cleanup, craft, and environmental awareness.",
        metadata: {
          address: "Sowon-myeon studio",
          capacityText: "Up to 6 guests",
          priceText: "KRW 25,000",
        },
      },
      "zh-cn": {
        title: "海滩拾物再生工艺工作坊",
        summary: "将海边拾来的材料变成小纪念品的环保手作体验。",
        description:
          "使用在海边收集的贝壳和海玻璃制作专属饰品。体验结合海岸清洁、手作与环境意识。",
        metadata: {
          address: "所愿面工坊",
          capacityText: "最多6人",
          priceText: "25,000韩元",
        },
      },
      "ja-jp": {
        title: "ビーチコーミング・アップサイクル工房",
        summary: "海辺で見つけた素材を小さな記念品に変える、環境にやさしいクラフト体験。",
        description:
          "浜辺で集めた貝殻やシーグラスを使って、自分だけのアクセサリーを作ります。海岸清掃、ものづくり、環境への気づきを合わせた体験です。",
        metadata: {
          address: "所願面工房",
          capacityText: "最大6名",
          priceText: "25,000ウォン",
        },
      },
    },
  },
  {
    targetType: "local_income_program",
    selector: { slug: "village-dining" },
    translations: {
      en: {
        title: "Seasonal Fishing-Village Table Prepared by Residents",
        summary: "A healthy local meal prepared with seafood and vegetables by the Cheonripo women's association.",
        description:
          "A seasonal table made with local seafood and vegetables grown in the village. The meal is prepared by residents and connected to community income.",
        metadata: {
          linkedLifeService: "Linked to local senior meal-support activities",
          residentRole: "Residents collect ingredients and the women's association prepares the meal",
          revenueUse: "30% community fund, 70% resident participation income",
          priceText: "KRW 15,000",
          capacityText: "Minimum 2 guests",
        },
      },
      "zh-cn": {
        title: "居民亲手准备的时令渔村餐桌",
        summary: "千里浦妇女会使用海产和蔬菜准备的健康本地餐。",
        description:
          "使用当地海产与村里种植的蔬菜制作的时令餐桌。由居民亲自准备，并与社区收入相连接。",
        metadata: {
          linkedLifeService: "与当地长者餐食支援活动联动",
          residentRole: "居民采集食材，妇女会负责料理",
          revenueUse: "30%用于村庄共同基金，70%作为居民参与收入",
          priceText: "15,000韩元",
          capacityText: "2人起",
        },
      },
      "ja-jp": {
        title: "住民が用意する季節の漁村ごはん",
        summary: "千里浦の婦人会が海産物と野菜で用意する、体にやさしい地域の食事。",
        description:
          "地域の海産物と村で育てた野菜を使った季節の食卓です。住民が調理を担い、地域の所得につながる仕組みになっています。",
        metadata: {
          linkedLifeService: "地域の高齢者食事支援活動と連携",
          residentRole: "住民が食材を集め、婦人会が調理を担当",
          revenueUse: "30%は村の共同基金、70%は参加住民の収入",
          priceText: "15,000ウォン",
          capacityText: "2名から",
        },
      },
    },
  },
  {
    targetType: "local_income_program",
    selector: { slug: "salt-farm-tour" },
    translations: {
      en: {
        title: "Traditional Salt-Field Experience and Sea Salt Sales",
        summary: "A hands-on sea-salt harvesting experience at a traditional Cheonil salt field.",
        description:
          "Meet a salt-field operator, learn how sea salt is made, and take part in a simple harvesting experience with premium local sea salt available for purchase inquiries.",
        metadata: {
          linkedLifeService: "Linked to youth work-experience education",
          residentRole: "Salt-field operators lead demonstrations and education",
          revenueUse: "Facility maintenance and village scholarship fund",
          priceText: "KRW 10,000",
          capacityText: "No strict limit",
        },
      },
      "zh-cn": {
        title: "传统盐田体验与海盐销售",
        summary: "在传统天日盐田体验海盐收获过程。",
        description:
          "与盐田经营者一起了解海盐制作过程，并参与简单的采盐体验。也可咨询优质本地海盐购买。",
        metadata: {
          linkedLifeService: "与青年工作体验教育联动",
          residentRole: "盐田经营者负责示范和讲解",
          revenueUse: "用于设施维护和村庄奖学基金",
          priceText: "10,000韩元",
          capacityText: "人数不限",
        },
      },
      "ja-jp": {
        title: "伝統塩田体験と海塩販売",
        summary: "伝統的な天日塩田で海塩づくりを体験します。",
        description:
          "塩田の運営者から海塩づくりの過程を学び、簡単な塩の収穫を体験します。上質な地域産海塩の購入相談も可能です。",
        metadata: {
          linkedLifeService: "若者の職業体験教育と連携",
          residentRole: "塩田運営者が実演と教育を担当",
          revenueUse: "施設維持管理と村の奨学基金に活用",
          priceText: "10,000ウォン",
          capacityText: "人数制限なし",
        },
      },
    },
  },
  {
    targetType: "local_income_program",
    selector: { slug: "woodworking-class" },
    translations: {
      en: {
        title: "Resident Woodworking Basics Class",
        summary: "A basic furniture-making class taught in the village woodworking space.",
        description:
          "A draft program where residents share basic woodworking skills and connect the activity to village home-repair volunteering.",
        metadata: {
          linkedLifeService: "Connected to volunteer repair work for older village homes",
          residentRole: "Local woodworkers share practical skills",
          revenueUse: "Purchase of shared workshop tools",
        },
      },
      "zh-cn": {
        title: "居民木工基础课堂",
        summary: "在村庄木工空间学习基础家具制作。",
        description:
          "这是一个草案项目，由居民分享基础木工技能，并与村庄老旧住房维修志愿服务相连接。",
        metadata: {
          linkedLifeService: "与村庄老旧住宅维修志愿服务联动",
          residentRole: "本地木工居民分享实用技术",
          revenueUse: "用于购买共同作业空间工具",
        },
      },
      "ja-jp": {
        title: "住民木工ベーシッククラス",
        summary: "村の木工作業場で学ぶ、基本的な家具づくり。",
        description:
          "住民が基礎的な木工技術を共有し、村の古い住宅修理ボランティアにもつなげる準備中のプログラムです。",
        metadata: {
          linkedLifeService: "村の古い住宅修理ボランティアと連携",
          residentRole: "地域の木工経験者が実用技術を共有",
          revenueUse: "共同作業場の工具購入に活用",
        },
      },
    },
  },
  {
    targetType: "local_income_program",
    selector: { slug: "sowon-sea-water-playground" },
    translations: {
      en: {
        title: "Sowon Natural Seawater Playground",
        summary: "An ecological learning activity at a safe natural seawater play area.",
        description:
          "A family-friendly local program where children learn about coastal ecology while playing safely in a natural seawater environment.",
        metadata: {
          linkedLifeService: "Connected to youth ecology education",
          residentRole: "Residents support safety guidance and ecology interpretation",
          revenueUse: "Environmental cleanup fund for the seawater play area",
          priceText: "Free, donation-based",
        },
      },
      "zh-cn": {
        title: "所愿天然海水游乐场",
        summary: "在安全的天然海水游乐区进行生态学习。",
        description:
          "适合家庭参与的本地项目，孩子们可以在天然海水环境中安全玩耍，同时学习海岸生态。",
        metadata: {
          linkedLifeService: "与青少年生态教育联动",
          residentRole: "居民负责安全引导和生态讲解",
          revenueUse: "用于海水游乐场环境整治基金",
          priceText: "免费，欢迎自愿捐助",
        },
      },
      "ja-jp": {
        title: "所願天然海水プレイグラウンド",
        summary: "安全な天然海水の遊び場で楽しむ、エコロジー学習体験。",
        description:
          "子どもたちが天然の海水環境で安全に遊びながら、海辺の生態を学べる家族向けの地域プログラムです。",
        metadata: {
          linkedLifeService: "青少年の生態教育と連携",
          residentRole: "住民が安全案内と生態解説を担当",
          revenueUse: "海水遊び場の環境整備基金に活用",
          priceText: "無料、寄付制",
        },
      },
    },
  },
  {
    targetType: "local_income_program",
    selector: { slug: "pension-kids-water-yard" },
    translations: {
      en: {
        title: "Kids' Water Yard at Local Pensions",
        summary: "A safe small water-play area set up in pension yards for children.",
        description:
          "A practical family-stay program where local pension hosts manage safe water-play spaces for children during the travel season.",
        metadata: {
          linkedLifeService: "Improves family-stay tourism infrastructure",
          residentRole: "Pension hosts jointly manage facilities and safety",
          revenueUse: "Maintenance and safety-equipment reserve",
          priceText: "Varies by facility",
        },
      },
      "zh-cn": {
        title: "民宿庭院儿童水上乐园",
        summary: "在民宿庭院设置的儿童安全玩水空间。",
        description:
          "这是面向家庭住宿的实用项目，由本地民宿经营者在旅游季共同管理儿童玩水空间和安全设施。",
        metadata: {
          linkedLifeService: "改善家庭型停留旅游基础设施",
          residentRole: "民宿经营者共同管理设施与安全",
          revenueUse: "用于维护和安全设备储备",
          priceText: "根据设施而定",
        },
      },
      "ja-jp": {
        title: "ペンション中庭キッズ水遊び場",
        summary: "ペンションの庭に設ける、子ども向けの安全な水遊びスペース。",
        description:
          "地域のペンション運営者が観光シーズンに子ども向けの水遊び場と安全設備を管理する、家族滞在向けの実用プログラムです。",
        metadata: {
          linkedLifeService: "家族滞在型観光インフラの改善と連携",
          residentRole: "ペンション運営者が施設と安全を共同管理",
          revenueUse: "維持管理と安全装備の準備に活用",
          priceText: "施設により異なる",
        },
      },
    },
  },
  {
    targetType: "local_income_program",
    selector: { slug: "local-table-experience" },
    translations: {
      en: {
        title: "Taean Local Seasonal Table",
        summary: "A seasonal course meal made with ingredients selected by local farmers.",
        description:
          "A warm table experience featuring Taean ingredients and stories from local growers, designed to support local produce sales and resident income.",
        metadata: {
          linkedLifeService: "Supports local farms and direct produce sales",
          residentRole: "Farmers supply ingredients and guide farm stories",
          revenueUse: "Resident income support and seed purchases",
          priceText: "KRW 50,000",
        },
      },
      "zh-cn": {
        title: "泰安本地时令餐桌",
        summary: "使用本地农户精选食材制作的时令套餐。",
        description:
          "以泰安本地食材和农户故事为核心的温暖餐桌体验，旨在支持本地农产销售和居民收入。",
        metadata: {
          linkedLifeService: "支持本地农户与农产直销",
          residentRole: "农户供应食材并讲述农场故事",
          revenueUse: "用于居民收入补充和种子购买",
          priceText: "50,000韩元",
        },
      },
      "ja-jp": {
        title: "泰安ローカル旬の食卓",
        summary: "地域の農家が選んだ食材で作る季節のコース料理。",
        description:
          "泰安の食材と生産者の物語を味わう温かな食卓体験です。地域農産物の販売と住民所得の支援につながります。",
        metadata: {
          linkedLifeService: "地域農家と農産物直販を支援",
          residentRole: "農家が食材を提供し、農園の物語を案内",
          revenueUse: "住民所得の補完と種子購入に活用",
          priceText: "50,000ウォン",
        },
      },
    },
  },
  {
    targetType: "local_income_program",
    selector: { slug: "gamtae-packing-class" },
    translations: {
      en: {
        title: "Handmade Gamtae Seaweed Gift Packing Class",
        summary: "Package local gamtae seaweed into a small gift set while learning its village story.",
        description:
          "A resident-led class where participants pack local gamtae seaweed into a gift set and learn how village branding can raise the value of local products.",
        metadata: {
          linkedLifeService: "Improves shared village brand value",
          residentRole: "Village elders teach packing and quality standards",
          revenueUse: "Instructor fees and package development",
          priceText: "KRW 30,000, gamtae included",
        },
      },
      "zh-cn": {
        title: "手作甘苔海苔礼盒包装课堂",
        summary: "将本地甘苔海苔包装成小礼盒，并了解其村庄故事。",
        description:
          "由居民带领的体验课程，参与者将本地甘苔海苔包装成礼盒，并了解村庄品牌如何提升本地产品价值。",
        metadata: {
          linkedLifeService: "提升村庄共同品牌价值",
          residentRole: "村里长者教授包装和品质标准",
          revenueUse: "用于讲师费用和包装开发",
          priceText: "30,000韩元，含甘苔海苔",
        },
      },
      "ja-jp": {
        title: "手作りカムテ海苔ギフト包装クラス",
        summary: "地域のカムテ海苔を小さなギフトに包みながら、村の物語を学びます。",
        description:
          "住民が進行するクラスで、地域のカムテ海苔をギフトセットに包装し、村のブランドが地域産品の価値を高める仕組みを学びます。",
        metadata: {
          linkedLifeService: "村の共同ブランド価値向上と連携",
          residentRole: "村の高齢者が包装と品質基準を指導",
          revenueUse: "講師謝金とパッケージ開発に活用",
          priceText: "30,000ウォン、カムテ海苔込み",
        },
      },
    },
  },
  {
    targetType: "local_income_program",
    selector: { slug: "harbor-morning-tour" },
    translations: {
      en: {
        title: "Lively Harbor Morning Tour",
        summary: "Walk through the harbor with a resident interpreter as the fish market opens.",
        description:
          "A morning walk that introduces harbor work, local stories, and the daily life of a fishing village through a resident guide.",
        metadata: {
          linkedLifeService: "Preserves and shares fishing-village culture",
          residentRole: "Former fishers and residents serve as interpreters",
          revenueUse: "Harbor welfare fund",
          priceText: "Free",
        },
      },
      "zh-cn": {
        title: "热闹渔港清晨导览",
        summary: "在渔市开始时，与居民讲解员一起漫步渔港。",
        description:
          "由居民向导带领的清晨散步，介绍渔港作业、本地故事和渔村的日常生活。",
        metadata: {
          linkedLifeService: "保护并传播渔村文化",
          residentRole: "前渔民和居民担任讲解员",
          revenueUse: "用于渔港福利基金",
          priceText: "免费",
        },
      },
      "ja-jp": {
        title: "活気ある港の朝ツアー",
        summary: "市場が動き出す朝の港を、住民ガイドと歩きます。",
        description:
          "住民ガイドが港の仕事、地域の物語、漁村の日常を紹介する朝の散策プログラムです。",
        metadata: {
          linkedLifeService: "漁村文化の保存と共有に連携",
          residentRole: "元漁師や住民が解説を担当",
          revenueUse: "漁港福祉基金に活用",
          priceText: "無料",
        },
      },
    },
  },
  {
    targetType: "local_income_program",
    selector: { slug: "shrimp-grill-experience" },
    translations: {
      en: {
        title: "Prawn Salt-Grill Experience",
        summary: "Grill fresh Taean prawns over salt with guidance from residents.",
        description:
          "Participants prepare and grill fresh Taean prawns with residents, learning simple local seafood techniques and enjoying the taste of the coast.",
        metadata: {
          linkedLifeService: "Linked to local seafood distribution support",
          residentRole: "Residents teach prawn preparation and grilling",
          revenueUse: "Resident income and fishing-village development fund",
          priceText: "KRW 25,000",
        },
      },
      "zh-cn": {
        title: "大虾盐烤体验",
        summary: "在居民指导下，用盐烤新鲜泰安大虾。",
        description:
          "参与者与居民一起处理并盐烤新鲜泰安大虾，学习简单的本地海鲜料理技巧，品尝海边风味。",
        metadata: {
          linkedLifeService: "与本地水产流通支援联动",
          residentRole: "居民教授大虾处理和烧烤方法",
          revenueUse: "用于居民收入和渔村发展基金",
          priceText: "25,000韩元",
        },
      },
      "ja-jp": {
        title: "車エビの塩焼き体験",
        summary: "住民の案内で、新鮮な泰安のエビを塩焼きにします。",
        description:
          "参加者が住民と一緒に新鮮な泰安のエビを下ごしらえし、塩焼きにします。地域の海産物の扱い方と海辺の味を楽しめます。",
        metadata: {
          linkedLifeService: "地域水産物の流通支援と連携",
          residentRole: "住民がエビの下処理と焼き方を指導",
          revenueUse: "住民所得と漁村発展基金に活用",
          priceText: "25,000ウォン",
        },
      },
    },
  },
  {
    targetType: "local_income_program",
    selector: { slug: "fishing-village-dining-class" },
    translations: {
      en: {
        title: "Fishing-Village Table Making Class",
        summary: "Learn traditional Taean cooking from village residents and prepare a local table together.",
        description:
          "A resident-led class that uses seasonal seafood to create a fishing-village table while sharing food stories from Sowon.",
        metadata: {
          linkedLifeService: "Connected to resident-led senior job creation",
          residentRole: "Women's association members teach cooking and storytelling",
          revenueUse: "Village senior welfare fund and instructor fees",
          priceText: "KRW 35,000",
        },
      },
      "zh-cn": {
        title: "渔村餐桌制作课堂",
        summary: "向村民学习泰安传统料理，并一起准备本地餐桌。",
        description:
          "由居民带领的料理课堂，使用时令海产制作渔村餐桌，同时分享所愿地区的饮食故事。",
        metadata: {
          linkedLifeService: "与居民主导的长者就业项目联动",
          residentRole: "妇女会成员教授料理和故事讲述",
          revenueUse: "用于村庄长者福利基金和讲师费用",
          priceText: "35,000韩元",
        },
      },
      "ja-jp": {
        title: "漁村の食卓づくりクラス",
        summary: "住民から泰安の伝統料理を学び、地域の食卓を一緒に作ります。",
        description:
          "季節の海産物を使って漁村の食卓を作りながら、所願の食の物語を聞く住民主導の料理クラスです。",
        metadata: {
          linkedLifeService: "住民主導の高齢者仕事づくりと連携",
          residentRole: "婦人会メンバーが料理と語りを担当",
          revenueUse: "村の高齢者福祉基金と講師謝金に活用",
          priceText: "35,000ウォン",
        },
      },
    },
  },
  {
    targetType: "local_income_program",
    selector: { slug: "shrimp-seafood-bbq" },
    translations: {
      en: {
        title: "Prawn and Seafood BBQ Party",
        summary: "A shared coastal BBQ with prawns, scallops, and seasonal seafood.",
        description:
          "Enjoy a community-style seafood BBQ by the sea with fresh prawns, scallops, and seasonal local seafood while meeting other travelers.",
        metadata: {
          linkedLifeService: "Improves shared evening safety infrastructure",
          residentRole: "Young residents set up BBQ facilities and guide safety",
          revenueUse: "Village evening safety equipment and youth activity fund",
          priceText: "KRW 45,000",
        },
      },
      "zh-cn": {
        title: "大虾海鲜烧烤派对",
        summary: "以大虾、扇贝和时令海鲜为主的海边共享烧烤。",
        description:
          "在海边与其他旅客一起享用新鲜大虾、扇贝和本地时令海鲜，体验共同体式海鲜烧烤。",
        metadata: {
          linkedLifeService: "改善村庄夜间安全基础设施",
          residentRole: "青年居民搭建烧烤设施并引导安全",
          revenueUse: "用于村庄夜间安全设备和青年活动基金",
          priceText: "45,000韩元",
        },
      },
      "ja-jp": {
        title: "エビと海鮮のバーベキューパーティー",
        summary: "エビ、ホタテ、旬の海産物を楽しむ海辺の共同BBQ。",
        description:
          "新鮮なエビやホタテ、地域の旬の海産物を海辺で焼き、旅行者同士が自然に交流できる共同体型のバーベキュープログラムです。",
        metadata: {
          linkedLifeService: "村の夜間安全インフラ改善と連携",
          residentRole: "若者住民がBBQ設備と安全案内を担当",
          revenueUse: "夜間安全装備と若者活動基金に活用",
          priceText: "45,000ウォン",
        },
      },
    },
  },
  {
    targetType: "course",
    selector: { slug: "sowon-one-day" },
    translations: {
      en: {
        title: "Sowon Seaside One-Day Course",
        summary: "A light day route from a sea-view stay to surfing and a fishing-village table.",
        description:
          "A one-day route that connects Mallipo and Cheonripo, introducing the calm appeal of Sowon's coastline through stay, experience, and local food.",
      },
      "zh-cn": {
        title: "所愿海边一日路线",
        summary: "从海景住宿到冲浪体验和渔村餐桌的轻松一日路线。",
        description:
          "连接万里浦与千里浦的一日行程，通过住宿、体验和本地餐食感受所愿海岸的安静魅力。",
      },
      "ja-jp": {
        title: "所願海辺の一日コース",
        summary: "海の見える宿、体験、漁村の食卓を軽やかにつなぐ一日ルート。",
        description:
          "万里浦と千里浦を結び、宿泊、体験、地域の食を通して所願の海辺の魅力を感じる一日コースです。",
      },
    },
  },
  {
    targetType: "course",
    selector: { slug: "artistic-retreat" },
    translations: {
      en: {
        title: "Creative Retreat with Local Craft",
        summary: "A quiet village route combining an upcycling craft experience and a restful stay.",
        description:
          "A slow retreat course for travelers who want a calm village atmosphere, hands-on craft, and time to rest near the sea.",
      },
      "zh-cn": {
        title: "与手作相伴的创意休憩路线",
        summary: "结合再生工艺体验与安静住宿的村庄慢行路线。",
        description:
          "适合想在安静村庄氛围中体验手作、靠近大海休息的旅客。",
      },
      "ja-jp": {
        title: "クラフトと過ごす創造的リトリート",
        summary: "アップサイクル工芸体験と静かな滞在を組み合わせた村のルート。",
        description:
          "静かな村の空気の中で手仕事を体験し、海の近くで休みたい旅行者に向いたゆったりしたコースです。",
      },
    },
  },
  {
    targetType: "course",
    selector: { slug: "family-2days-sowon" },
    translations: {
      en: {
        title: "Family-Friendly 2-Day Sowon Course",
        summary: "A safe two-day route designed to minimize travel between stops for families with children.",
        description:
          "A family course that combines safe water play, a local table, and a calm morning harbor walk with easy movement between locations.",
      },
      "zh-cn": {
        title: "亲子型所愿两天一夜路线",
        summary: "为亲子家庭设计、尽量减少移动距离的安全两日路线。",
        description:
          "结合儿童玩水、本地餐桌和清晨渔港散步的家庭路线，移动轻松，适合带孩子旅行。",
      },
      "ja-jp": {
        title: "家族向け所願1泊2日コース",
        summary: "子ども連れでも移動しやすい、安全重視の2日間ルート。",
        description:
          "水遊び、地域の食卓、朝の港散策を組み合わせた家族向けコースです。移動を抑え、安心して過ごせます。",
      },
    },
  },
  {
    targetType: "course",
    selector: { slug: "sunset-couple-course" },
    translations: {
      en: {
        title: "Mallipo Sunset Couple Course",
        summary: "A romantic route with seaside cafe time, a sunset walk, and a local dinner.",
        description:
          "A half-day course for couples, connecting the mood of Mallipo's sea, photos at sunset, a relaxing stay, and a resident-prepared local meal.",
      },
      "zh-cn": {
        title: "万里浦落日情侣路线",
        summary: "结合海边咖啡、落日散步和本地晚餐的浪漫路线。",
        description:
          "适合情侣的半日路线，串联万里浦海边氛围、落日照片、舒适住宿和居民准备的本地餐食。",
      },
      "ja-jp": {
        title: "万里浦サンセット・カップルコース",
        summary: "海辺のカフェ、夕日散策、地域の夕食をつなぐロマンチックなルート。",
        description:
          "万里浦の海辺の雰囲気、夕日の写真、くつろぎの宿、住民が用意する地域の食事をつなぐ、カップル向けの半日コースです。",
      },
    },
  },
  {
    targetType: "course",
    selector: { slug: "fishing-village-half-day" },
    translations: {
      en: {
        title: "Fishing Village Half-Day Walk",
        summary: "A slow half-day trip to feel the sound and pace of a quiet harbor village.",
        description:
          "Start the morning at the harbor, learn about local seaweed, and leave time for a relaxed local lunch.",
      },
      "zh-cn": {
        title: "渔村半日漫步",
        summary: "在安静渔港感受海声与生活节奏的半日旅行。",
        description:
          "从清晨渔港开始，了解本地海苔故事，并留出时间慢慢享用本地午餐。",
      },
      "ja-jp": {
        title: "漁村半日さんぽ",
        summary: "静かな港町で海の音と暮らしのリズムを感じる半日旅。",
        description:
          "朝の港から始まり、地域の海苔の話を聞き、ゆっくり地元の昼食を楽しむ余白を持たせたコースです。",
      },
    },
  },
  {
    targetType: "course",
    selector: { slug: "esg-beach-clean-course" },
    translations: {
      en: {
        title: "A Meaningful Day: ESG Beach Course",
        summary: "A value-driven route combining beach cleanup and upcycling craft.",
        description:
          "A course for teams, families, or travelers who want to enjoy the coast while contributing to the local environment.",
      },
      "zh-cn": {
        title: "有意义的一天：ESG海边路线",
        summary: "结合海滩清洁与再生工艺的价值旅行路线。",
        description:
          "适合团体、家庭或希望一边旅行一边为当地环境做出贡献的旅客。",
      },
      "ja-jp": {
        title: "意味のある一日、ESG海辺コース",
        summary: "ビーチクリーンとアップサイクル工芸を組み合わせた価値ある旅。",
        description:
          "海を楽しみながら地域の環境に貢献したい団体、家族、旅行者に向いたコースです。",
      },
    },
  },
  {
    targetType: "course",
    selector: { slug: "kids-local-experience-course" },
    translations: {
      en: {
        title: "Kids' Local Experience Day",
        summary: "A one-day nature and ecology course where children play, observe, and learn.",
        description:
          "A child-friendly route that lets kids explore coastal nature, play safely, and collect small memories around the village.",
      },
      "zh-cn": {
        title: "儿童本地体验一日游",
        summary: "让孩子在自然中玩耍、观察和学习的一日生态路线。",
        description:
          "面向儿童的路线，让孩子安全地接触海岸自然，并在村庄中留下小小旅行记忆。",
      },
      "ja-jp": {
        title: "子ども向けローカル体験一日コース",
        summary: "子どもが自然の中で遊び、観察し、学べる一日エコロジーコース。",
        description:
          "子どもが海辺の自然にふれ、安全に遊び、村で小さな思い出を集められるファミリー向けルートです。",
      },
    },
  },
  {
    targetType: "training_course",
    selector: { title: "지역 관광 가이드 역량 강화 교육 (기초)" },
    translations: {
      en: {
        title: "Local Tourism Guide Capacity-Building Course: Basics",
        summary: "Training in Sowon storytelling and visitor communication.",
        description:
          "A basic course for residents and operators who want to improve local storytelling, guest communication, and visitor guidance.",
      },
      "zh-cn": {
        title: "本地旅游向导能力提升课程（基础）",
        summary: "所愿地区故事讲述与游客接待教育。",
        description:
          "面向居民和经营者的基础课程，帮助提升本地故事讲述、游客沟通和现场引导能力。",
      },
      "ja-jp": {
        title: "地域観光ガイド能力向上講座（基礎）",
        summary: "所願地域のストーリーテリングと接客対応を学ぶ講座。",
        description:
          "住民や事業者が地域の物語、旅行者とのコミュニケーション、現場案内力を高めるための基礎講座です。",
      },
    },
  },
  {
    targetType: "certification",
    selector: { title: "소원면 우수 주민사업장 인증" },
    translations: {
      en: {
        title: "Sowon Excellent Resident-Run Business Certification",
        summary: "Certified for service quality and contribution to the local community.",
        description:
          "A certification for resident-run businesses that meet basic service standards and contribute to local circulation and community benefit.",
      },
      "zh-cn": {
        title: "所愿面优秀居民经营场所认证",
        summary: "已完成服务质量与地区回馈贡献度验证。",
        description:
          "面向居民经营场所的认证，确认其符合基本服务标准，并对本地循环和社区利益作出贡献。",
      },
      "ja-jp": {
        title: "所願面優秀住民事業場認証",
        summary: "サービス品質と地域還元への貢献を確認した認証。",
        description:
          "基本的なサービス基準を満たし、地域循環とコミュニティへの貢献が確認された住民運営事業者向けの認証です。",
      },
    },
  },
  {
    targetType: "event",
    selector: { title: "바다마을 체험 주간" },
    translations: {
      en: {
        title: "Seaside Village Experience Week",
        summary: "A connected notice introducing stays and experiences together.",
        description:
          "An operating notice that helps visitors browse Sowon's stays, experiences, and local income programs in one flow.",
        metadata: { tag: "Sowon Weekend Feature" },
      },
      "zh-cn": {
        title: "海边村庄体验周",
        summary: "将住宿和体验一起介绍的联动型消息。",
        description:
          "这是一条运营消息，帮助游客一次了解所愿地区的住宿、体验和居民收入商品。",
        metadata: { tag: "所愿周末企划" },
      },
      "ja-jp": {
        title: "海辺の村体験ウィーク",
        summary: "宿泊と体験を一緒に紹介する連動型のお知らせ。",
        description:
          "所願地域の宿泊、体験、住民所得商品を一つの流れで見られるようにする運営からのお知らせです。",
        metadata: { tag: "所願週末企画" },
      },
    },
  },
  {
    targetType: "event",
    selector: { title: "주민소득상품 집중 소개" },
    translations: {
      en: {
        title: "Featured Local Income Programs",
        summary: "Resident-run local food and craft programs.",
        description:
          "A featured notice highlighting local income programs built around residents, local ingredients, and community circulation.",
        metadata: { tag: "Local Product Pick" },
      },
      "zh-cn": {
        title: "居民收入商品重点介绍",
        summary: "由居民运营的本地餐食与手作项目。",
        description:
          "重点介绍以居民、本地食材和社区循环为核心的居民收入商品。",
        metadata: { tag: "本地商品推荐" },
      },
      "ja-jp": {
        title: "住民所得商品ピックアップ",
        summary: "住民が運営する地域の食とクラフトプログラム。",
        description:
          "住民、地域食材、地域循環を軸にした住民所得商品を紹介する注目のお知らせです。",
        metadata: { tag: "ローカル商品特集" },
      },
    },
  },
  {
    targetType: "event",
    selector: { title: "추천 코스 미리보기" },
    translations: {
      en: {
        title: "Preview Curated Itineraries",
        summary: "Suggested routes connecting stays, experiences, and local tastes.",
        description:
          "Browse suggested routes built from Sowon's published stays, experiences, and local income programs.",
        metadata: { tag: "Course Preview" },
      },
      "zh-cn": {
        title: "推荐路线预览",
        summary: "连接住宿、体验和本地风味的推荐动线。",
        description:
          "浏览由所愿地区已公开住宿、体验和居民收入商品组成的推荐路线。",
        metadata: { tag: "路线预览" },
      },
      "ja-jp": {
        title: "おすすめコース先取り",
        summary: "宿泊、体験、地域の味をつなぐおすすめ動線。",
        description:
          "所願地域で公開されている宿泊、体験、住民所得商品を組み合わせたおすすめコースを確認できます。",
        metadata: { tag: "コースプレビュー" },
      },
    },
  },
  {
    targetType: "event",
    selector: { title: "소원 로컬 혜택 모음" },
    translations: {
      en: {
        title: "Sowon Local Offers",
        summary: "Useful participation notices and seasonal benefits.",
        description:
          "A collection of notices and seasonal offers to check before visiting. This is an inquiry-and-connection notice, not a confirmed booking or payment discount.",
        metadata: { tag: "Local Offers" },
      },
      "zh-cn": {
        title: "所愿本地优惠合集",
        summary: "出行前值得查看的参与信息与季节优惠。",
        description:
          "汇集访问前值得确认的参与消息和季节性优惠。这是咨询与连接型 안내，并非已确认的预约或支付折扣。",
        metadata: { tag: "本地优惠" },
      },
      "ja-jp": {
        title: "ソウォン・ローカル特典まとめ",
        summary: "訪問前に確認したい参加情報と季節の特典。",
        description:
          "訪問前にチェックしておきたい参加ニュースと季節の特典をまとめました。予約や決済の割引確定ではなく、問い合わせ・接続のためのお知らせです。",
        metadata: { tag: "ローカル特典" },
      },
    },
  },
];

function metadataToJson(metadata?: Record<string, string>) {
  if (!metadata || Object.keys(metadata).length === 0) {
    return Prisma.JsonNull;
  }

  return metadata;
}

async function findTarget(
  prisma: ReturnType<typeof getPrisma>,
  regionId: string,
  entry: TranslationEntry
) {
  const { slug, title } = entry.selector;

  switch (entry.targetType) {
    case "accommodation":
      return slug
        ? prisma.accommodation.findFirst({ where: { regionId, slug }, select: { id: true, title: true } })
        : null;
    case "experience":
      return slug
        ? prisma.experience.findFirst({ where: { regionId, slug }, select: { id: true, title: true } })
        : null;
    case "local_income_program":
      return slug
        ? prisma.localIncomeProgram.findFirst({ where: { regionId, slug }, select: { id: true, title: true } })
        : null;
    case "course":
      return slug
        ? prisma.course.findFirst({ where: { regionId, slug }, select: { id: true, title: true } })
        : null;
    case "training_course":
      return title
        ? prisma.trainingCourse.findFirst({ where: { regionId, title }, select: { id: true, title: true } })
        : null;
    case "certification":
      return title
        ? prisma.certification.findFirst({ where: { regionId, title }, select: { id: true, title: true } })
        : null;
    case "event":
      return title
        ? prisma.event.findFirst({ where: { regionId, title }, select: { id: true, title: true } })
        : null;
    default:
      return null;
  }
}

async function collectCurrentContentCounts(
  prisma: ReturnType<typeof getPrisma>,
  regionId: string
) {
  const [
    accommodation,
    experience,
    localIncomeProgram,
    course,
    trainingCourse,
    certification,
    event,
  ] = await Promise.all([
    prisma.accommodation.count({ where: { regionId } }),
    prisma.experience.count({ where: { regionId } }),
    prisma.localIncomeProgram.count({ where: { regionId } }),
    prisma.course.count({ where: { regionId } }),
    prisma.trainingCourse.count({ where: { regionId } }),
    prisma.certification.count({ where: { regionId } }),
    prisma.event.count({ where: { regionId } }),
  ]);

  return {
    accommodation,
    experience,
    local_income_program: localIncomeProgram,
    course,
    training_course: trainingCourse,
    certification,
    event,
  };
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const prisma = getPrisma();

  const region = await prisma.region.findUnique({
    where: { slug: "sowon" },
    select: { id: true, name: true },
  });

  if (!region) {
    throw new Error("Region `sowon` was not found.");
  }

  const counts = await collectCurrentContentCounts(prisma, region.id);
  let matchedTargets = 0;
  let upsertedRows = 0;
  const missing: TranslationEntry[] = [];

  for (const entry of translations) {
    const target = await findTarget(prisma, region.id, entry);
    if (!target) {
      missing.push(entry);
      continue;
    }

    matchedTargets += 1;

    for (const locale of CONTENT_TRANSLATION_LOCALES) {
      const translation = entry.translations[locale];
      if (dryRun) {
        upsertedRows += 1;
        continue;
      }

      await prisma.contentTranslation.upsert({
        where: {
          targetType_targetId_locale: {
            targetType: entry.targetType,
            targetId: target.id,
            locale,
          },
        },
        update: {
          title: translation.title,
          summary: translation.summary ?? null,
          description: translation.description ?? null,
          metadata: metadataToJson(translation.metadata),
        },
        create: {
          regionId: region.id,
          targetType: entry.targetType,
          targetId: target.id,
          locale,
          title: translation.title,
          summary: translation.summary ?? null,
          description: translation.description ?? null,
          metadata: metadataToJson(translation.metadata),
        },
      });

      upsertedRows += 1;
    }
  }

  const translationCount = dryRun
    ? 0
    : await prisma.contentTranslation.count({ where: { regionId: region.id } });

  console.log(
    JSON.stringify(
      {
        mode: dryRun ? "dry-run" : "write",
        region: region.name,
        currentContentCounts: counts,
        curatedTargets: translations.length,
        matchedTargets,
        upsertedRows,
        missingTargets: missing.map((entry) => ({
          targetType: entry.targetType,
          selector: entry.selector,
        })),
        totalTranslationRowsInRegion: translationCount,
      },
      null,
      2
    )
  );

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  process.exitCode = 1;
});
