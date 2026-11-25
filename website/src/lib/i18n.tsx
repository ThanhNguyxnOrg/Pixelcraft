import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { readUrlParam, writeUrlParams } from "./urlState";

export type Locale = "en" | "vi";

const COPY = {
  en: {
    nav: {
      gallery: "Gallery",
      demos: "Demos",
      loop: "Loop",
      blueprint: "Blueprint",
      skills: "Skills",
      install: "Install",
      tools: "Tools",
      floor: "Floor",
    },
    dock: {
      demos: "Demos",
      proofs: "Proofs",
      loop: "Loop",
      skills: "Skills",
      install: "Install",
    },
    masthead: {
      badgeTail: "Agent Skills",
      avg: "Agents design the average.",
      claimPrefix: "Pixelcraft makes them ",
      claimAccent: "diverge.",
      lede: "An open-source skill pack for coding agents. It forces divergent directions before code, applies an accessibility and UX floor by default, and reports only what was actually verified.",
      ctaGithub: "View on GitHub",
      ctaGallery: (n: number) => `Inspect ${n} exhibits`,
      stats: [
        "skills",
        "reference files",
        "scripts that run",
        "agent targets",
      ] as const,
      resLabel: "Specimen resolution",
    },
    demos: {
      kicker: "Pixelcraft, in small moves",
      titleLine1: "Less default.",
      titleLine2: "More deliberate.",
      lede: "Three interactive studies. One design loop. Authored illustrations and real captures, not live AI runs.",
    },
    gallery: {
      kicker: (n: number) =>
        `Multi-stack proof workbench · ${n} surfaces · 5 ecosystems`,
      title: (n: number) =>
        `Not just React landing pages. ${n} real surface diffs.`,
      lede: "Compare default agent output against Pixelcraft across SwiftUI, Jetpack Compose, Flutter, Rust Ratatui, Tauri v2, Python marimo, Elixir LiveView, MJML email, Typst PDF, Godot 4.5 HUD, and modern web frameworks — with live mobile/desktop stages and direct demos.",
      loading: "Loading 22 multi-stack exhibits and scanner evidence…",
    },
    blueprint: {
      kicker: "Production engineering standard · 8 pillars",
      title: "What separates engineered craft from a reskinned template.",
      lede: "High-value software isn’t measured by page count. Inspect how strategy, design tokens, performance, technical SEO, accessibility, security, and automated QA are wired into this showcase and every exhibit.",
      shortcutLabel: "Commodity template shortcut",
      standardLabel: "Engineered production standard",
      shippedLabel: "Shipped implementation in this repository",
      zeroTelemetry: "0 cookies · 0 trackers · 100% source-verifiable",
    },
    footer: {
      kicker: "Next step",
      headline: "Install it. Then make your agent show its work.",
      blurb:
        "Portable Agent Skills for distinctive, evidence-verified UI and rigorous UX across frontend stacks.",
      privacyNote:
        "0 cookies · 0 analytics trackers · 100% self-hosted fonts & assets",
      legalBtn: "Privacy & MIT",
      pauseMotion: "Pause page motion",
      resumeMotion: "Resume page motion",
      reportTitle: "Report for this page",
    },
  },
  vi: {
    nav: {
      gallery: "Gallery",
      demos: "Demo",
      loop: "Quy trình",
      blueprint: "Tiêu chuẩn",
      skills: "Skills",
      install: "Cài đặt",
      tools: "Công cụ",
      floor: "Nền tảng",
    },
    dock: {
      demos: "Demo",
      proofs: "Mẫu",
      loop: "Loop",
      skills: "Skills",
      install: "Cài đặt",
    },
    masthead: {
      badgeTail: "Agent Skills",
      avg: "AI thường thiết kế theo lối mòn.",
      claimPrefix: "Pixelcraft buộc chúng ",
      claimAccent: "tạo khác biệt.",
      lede: "Bộ kỹ năng mã nguồn mở cho coding agent: ép tìm phương án khác biệt trước khi viết code, áp đặt nền tảng accessibility & UX mặc định và chỉ báo cáo đúng những gì đã kiểm chứng.",
      ctaGithub: "Xem trên GitHub",
      ctaGallery: (n: number) => `Xem ${n} web mẫu`,
      stats: [
        "kỹ năng",
        "tài liệu stack",
        "script kiểm thử",
        "coding agent",
      ] as const,
      resLabel: "Độ phân giải mẫu",
    },
    demos: {
      kicker: "Pixelcraft · qua từng thao tác nhỏ",
      titleLine1: "Bớt rập khuôn.",
      titleLine2: "Tăng chủ đích.",
      lede: "Ba mô phỏng tương tác cho một vòng lặp thiết kế. Minh hoạ và ảnh chụp thực tế đã biên tập, không gọi AI trực tiếp.",
    },
    gallery: {
      kicker: (n: number) =>
        `Bàn kiểm chứng đa stack · ${n} giao diện · 5 hệ sinh thái`,
      title: (n: number) =>
        `Không chỉ landing page React. ${n} đối chiếu đa nền tảng.`,
      lede: "So sánh đầu ra mặc định với Pixelcraft trên SwiftUI, Jetpack Compose, Flutter, Rust Ratatui, Tauri v2, Python marimo, Elixir LiveView, MJML email, Typst PDF, Godot 4.5 HUD và các web framework hiện đại.",
      loading: "Đang tải 22 giao diện mẫu và dữ liệu quét mã nguồn…",
    },
    blueprint: {
      kicker: "Tiêu chuẩn kỹ thuật sản phẩm · 8 trụ cột",
      title: "Điều phân biệt sản phẩm may đo với template chỉnh sửa.",
      lede: "Giá trị sản phẩm không đo bằng số lượng trang. Kiểm tra trực tiếp cách chiến lược, design system, hiệu năng, SEO kỹ thuật, WCAG 2.2 AA, bảo mật và QA tự động được triển khai trong repo này.",
      shortcutLabel: "Lối tắt của template giá rẻ",
      standardLabel: "Chuẩn kỹ thuật sản phẩm may đo",
      shippedLabel: "Triển khai thực tế trong kho mã nguồn này",
      zeroTelemetry:
        "0 cookie · 0 mã theo dõi · 100% kiểm chứng được trong mã nguồn",
    },
    footer: {
      kicker: "Bước tiếp theo",
      headline: "Cài đặt ngay. Và bắt agent chứng minh kết quả.",
      blurb:
        "Bộ Agent Skills di động cho giao diện độc bản, kiểm chứng bằng bằng chứng và chuẩn UX chặt chẽ trên mọi tech stack.",
      privacyNote:
        "0 cookie · 0 analytics theo dõi · 100% font & tài nguyên tự host",
      legalBtn: "Bảo mật & MIT",
      pauseMotion: "Tạm dừng chuyển động",
      resumeMotion: "Tiếp tục chuyển động",
      reportTitle: "Báo cáo kiểm chứng trang này",
    },
  },
} as const;

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (typeof COPY)[Locale];
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
  t: COPY.en,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() =>
    readUrlParam("lang") === "vi" ? "vi" : "en",
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    writeUrlParams({ lang: next === "en" ? null : next });
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: COPY[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
