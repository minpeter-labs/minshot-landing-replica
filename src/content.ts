export type Language = "en" | "zh";

export type FeatureIconName =
  | "capture"
  | "annotate"
  | "arrow"
  | "backdrop"
  | "multiCapture"
  | "recent";

export type PricingAction =
  | { readonly kind: "download" }
  | { readonly kind: "link"; readonly href: string; readonly label: string };

export interface PricingPlan {
  readonly action: PricingAction;
  readonly copy: string;
  readonly features: readonly string[];
  readonly name: string;
  readonly price: string;
}

export interface PageContent {
  readonly downloadLabel: string;
  readonly features: readonly {
    readonly icon: FeatureIconName;
    readonly name: string;
    readonly description: string;
  }[];
  readonly featuresTitle: string;
  readonly footer: {
    readonly download: string;
    readonly contact: string;
    readonly language: {
      readonly href: string;
      readonly hreflang: string;
      readonly label: string;
      readonly lang: string;
      readonly text: string;
    };
    readonly madeByPrefix: string;
    readonly madeBySuffix: string;
  };
  readonly header: {
    readonly homeLabel: string;
    readonly navigationLabel: string;
    readonly pricing: string;
    readonly follow: string;
  };
  readonly hero: {
    readonly title: string;
    readonly subtitle: string;
    readonly imageAlt: string;
  };
  readonly meta: {
    readonly lang: string;
    readonly title: string;
    readonly description: string;
    readonly canonical: string;
  };
  readonly pricing: {
    readonly title: string;
    readonly copy: string;
    readonly plans: readonly PricingPlan[];
  };
}

const licenseCheckoutUrl =
  "https://gridea.lemonsqueezy.com/checkout/buy/c48be1a9-94b5-43d8-a52d-b1fe2971ffe9?logo=0";

const pages = {
  en: {
    meta: {
      lang: "en",
      title: "Minshot — A native macOS screenshot tool",
      description:
        "Capture, annotate, and frame your screenshots on macOS. Fast, native, and beautiful. $4.99 once, on up to 2 Macs.",
      canonical: "https://minshot.fehey.com",
    },
    header: {
      homeLabel: "Minshot home",
      navigationLabel: "Main navigation",
      pricing: "Pricing",
      follow: "Follow for updates",
    },
    hero: {
      title: "A native macOS screenshot tool",
      subtitle:
        "Capture, annotate, and frame your screenshots — fast, and beautifully.",
      imageAlt: "A screenshot captured, annotated, and framed with Minshot",
    },
    downloadLabel: "Download for Mac",
    featuresTitle: "Everything you need, nothing you don't",
    features: [
      {
        icon: "capture",
        name: "Capture anything",
        description: " — area, window, or full screen.",
      },
      {
        icon: "annotate",
        name: "Annotate",
        description: " — arrows, text, boxes, blur, counters.",
      },
      {
        icon: "arrow",
        name: "Hand-drawn arrows",
        description: " — sketch-style, not clip-art.",
      },
      {
        icon: "backdrop",
        name: "Backdrop",
        description: " — frame shots in a beautiful background.",
      },
      {
        icon: "multiCapture",
        name: "Multi-capture",
        description: " — stitch several shots into one.",
      },
      {
        icon: "recent",
        name: "Reopen recent",
        description: " — jump back to your last few shots — every edit intact.",
      },
    ],
    pricing: {
      title: "Free to use. $4.99 to own.",
      copy: "Minshot is free for everyday use — light users never have to pay.",
      plans: [
        {
          name: "Free",
          price: "forever",
          copy: "Up to 5 screenshots a day — more than enough for most days.",
          features: [
            "Capture area, window, or full screen",
            "Annotate — arrows, text, boxes, blur, counters",
            "Hand-drawn arrows and Backdrop framing",
            "Multi-capture, stitched into one image",
            "Past 5 a day, a gentle reminder — never a block",
          ],
          action: { kind: "download" },
        },
        {
          name: "Pro",
          price: "$4.99 — once",
          copy: "For the days five isn't enough — and to back a solo developer.",
          features: [
            "Unlimited screenshots — no daily count",
            "No more upgrade reminder",
            "Works on up to 2 Macs",
            "Free updates, forever",
            "$4.99 once — no subscription, ever",
          ],
          action: {
            kind: "link",
            href: licenseCheckoutUrl,
            label: "Buy a license",
          },
        },
      ],
    },
    footer: {
      download: "Download",
      contact: "Contact",
      language: {
        href: "/zh",
        hreflang: "zh-Hans",
        label: "Switch to Chinese",
        lang: "zh-Hans",
        text: "中文",
      },
      madeByPrefix: "Made by ",
      madeBySuffix: ". © 2026 Minshot.",
    },
  },
  zh: {
    meta: {
      lang: "zh-Hans",
      title: "Minshot · 原生 macOS 截图工具",
      description:
        "在 macOS 上截图、标注、加背景。原生、快、好看。$4.99 一次买断，最多 2 台 Mac。",
      canonical: "https://minshot.fehey.com/zh",
    },
    header: {
      homeLabel: "Minshot home",
      navigationLabel: "Main navigation",
      pricing: "价格",
      follow: "关注更新",
    },
    hero: {
      title: "原生 macOS 截图工具",
      subtitle: "截图、标注、再配上漂亮的背景 —— 快，而且好看。",
      imageAlt: "用 Minshot 截取、标注并加上背景的截图",
    },
    downloadLabel: "下载 Mac 版",
    featuresTitle: "该有的都有，多余的没有",
    features: [
      {
        icon: "capture",
        name: "随心截取",
        description: " —— 区域、窗口，或整个屏幕。",
      },
      {
        icon: "annotate",
        name: "标注",
        description: " —— 箭头、文字、方框、模糊、序号。",
      },
      {
        icon: "arrow",
        name: "手绘箭头",
        description: " —— 随手画的质感，不是模板素材。",
      },
      {
        icon: "backdrop",
        name: "精致背景",
        description: " —— 给截图配上好看的背景。",
      },
      {
        icon: "multiCapture",
        name: "多张拼接",
        description: " —— 把几张截图拼成一张。",
      },
      {
        icon: "recent",
        name: "回看最近",
        description: " —— 随时回到前几张截图 —— 标注原样还在。",
      },
    ],
    pricing: {
      title: "免费就能用。$4.99 买断。",
      copy: "日常使用完全免费 —— 轻度用户永远不用付费。",
      plans: [
        {
          name: "免费",
          price: "永久",
          copy: "每天最多 5 张 —— 大多数日子绰绰有余。",
          features: [
            "区域、窗口或整个屏幕截图",
            "标注 —— 箭头、文字、方框、模糊、序号",
            "手绘箭头 + 精致背景",
            "多张拼接成一张",
            "超过 5 张后温和提醒一下 —— 但从不拦你",
          ],
          action: { kind: "download" },
        },
        {
          name: "Pro",
          price: "$4.99 · 一次性",
          copy: "给截图量大的日子 —— 也支持一下独立开发者。",
          features: [
            "无限截图 —— 不再计数",
            "不再有升级提醒",
            "最多 2 台 Mac",
            "永久免费更新",
            "$4.99 一次买断 —— 永不订阅",
          ],
          action: { kind: "link", href: licenseCheckoutUrl, label: "购买授权" },
        },
      ],
    },
    footer: {
      download: "下载",
      contact: "联系",
      language: {
        href: "/",
        hreflang: "en",
        label: "切换为英文",
        lang: "en",
        text: "English",
      },
      madeByPrefix: "由 ",
      madeBySuffix: " 制作 · © 2026 Minshot",
    },
  },
} satisfies Record<Language, PageContent>;

export const getPageContent = (language: Language): PageContent =>
  pages[language];
