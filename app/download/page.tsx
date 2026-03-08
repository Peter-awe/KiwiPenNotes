"use client";

import { useState, useEffect } from "react";
import {
  Monitor,
  Smartphone,
  Chrome,
  ChevronRight,
  Check,
  ExternalLink,
  Share,
  Plus,
  Download,
  ShieldAlert,
  MousePointer,
} from "lucide-react";
import { useLocale } from "@/lib/i18n";

type Platform = "ios" | "macos" | "web";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "web";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return "ios";
  if (/Macintosh|Mac OS X/.test(ua)) return "macos";
  return "web";
}

function detectArch(): "arm64" | "x64" | "unknown" {
  if (typeof navigator === "undefined") return "unknown";
  // Apple Silicon Macs report arm in platform or userAgentData
  // @ts-expect-error userAgentData is not in all TS defs
  const uaData = navigator.userAgentData;
  if (uaData?.platform === "macOS") return "arm64"; // modern Macs are mostly Apple Silicon
  // Fallback: check if CPU class hints at ARM
  if (/Mac/.test(navigator.platform)) {
    // Most Macs sold since late 2020 are Apple Silicon
    return "arm64";
  }
  return "unknown";
}

const RELEASE_BASE = "https://github.com/Peter-awe/KiwiPenNotes-desktop/releases/latest";
const DMG_ARM64 = "https://github.com/Peter-awe/KiwiPenNotes-desktop/releases/latest/download/KiwiPenNotes-1.0.0-arm64.dmg";
const DMG_INTEL = "https://github.com/Peter-awe/KiwiPenNotes-desktop/releases/latest/download/KiwiPenNotes-1.0.0.dmg";

const text = {
  en: {
    title: "Download KiwiPenNotes",
    subtitle: "Choose your platform. The web version is always free and ready to use.",
    detected: "Detected: You're on",
    deviceNames: { ios: "iPhone / iPad", macos: "macOS", web: "Desktop / Android" },
    web: {
      name: "Web App",
      status: "Available Now",
      desc: "Works in Chrome & Edge. No download needed. All features included for free.",
      cta: "Open Web App",
      features: ["Real-time transcription", "Live translation", "AI analysis", "Meeting summary"],
    },
    macos: {
      name: "macOS",
      status: "Available Now",
      desc: "Native desktop app. Dedicated window for your meetings, runs alongside other apps.",
      ctaAppleSilicon: "Download for Apple Silicon",
      ctaIntel: "Download for Intel Mac",
      ctaAll: "All Downloads",
      features: ["Everything in Web", "Native macOS window", "Microphone auto-granted", "Menu bar integration"],
    },
    ios: {
      name: "iPhone / iPad",
      status: "Available via PWA",
      desc: "Add to your Home Screen for a native-like experience. Instant access, no App Store needed.",
      cta: "How to Install",
      features: ["Everything in Web", "Home Screen app icon", "Standalone fullscreen", "Works offline"],
    },
    pwaSteps: {
      title: "Install on iPhone / iPad",
      step1: "Open kiwipennotes.com in Safari",
      step2: "Tap the Share button",
      step3: "Scroll down and tap \"Add to Home Screen\"",
      step4: "Tap \"Add\" — done! Open from your Home Screen.",
    },
    macSteps: {
      title: "macOS Installation Guide",
      subtitle: "First time opening? macOS may show a security warning — this is normal for apps downloaded outside the App Store.",
      step1: "Open the downloaded .dmg file",
      step2: "Drag KiwiPenNotes into the Applications folder",
      step3: "Open Applications, find KiwiPenNotes, RIGHT-CLICK (or Control+click) on it",
      step4: "Select \"Open\" from the menu",
      step5: "Click \"Open\" in the pop-up dialog — done! It will open normally from now on.",
      note: "This is a one-time step. After the first launch, you can open the app normally by double-clicking.",
      whyTitle: "Why does this happen?",
      whyDesc: "macOS protects you from apps not downloaded from the App Store. This is the standard way to open apps from independent developers. Many popular apps (Homebrew, OBS, etc.) require the same step.",
    },
    sysReq: "System Requirements",
    webReq: ["Chrome 90+ or Edge 90+", "Microphone access"],
    macReq: ["macOS 13 Ventura or later", "Apple Silicon or Intel"],
    iosReq: ["iOS / iPadOS 16.4+", "Safari browser"],
  },
  zh: {
    title: "下载 KiwiPenNotes",
    subtitle: "选择你的平台，网页版永远免费。",
    detected: "检测到：你正在使用",
    deviceNames: { ios: "iPhone / iPad", macos: "macOS", web: "桌面 / Android" },
    web: {
      name: "网页版",
      status: "现已可用",
      desc: "支持 Chrome 和 Edge，无需下载，所有功能免费。",
      cta: "打开网页版",
      features: ["实时语音转录", "即时翻译", "AI 分析", "会议总结"],
    },
    macos: {
      name: "macOS",
      status: "现已可用",
      desc: "原生桌面应用，独立窗口运行会议转录，和其他应用并行使用。",
      ctaAppleSilicon: "下载 Apple Silicon 版",
      ctaIntel: "下载 Intel Mac 版",
      ctaAll: "所有下载",
      features: ["包含网页版全部功能", "原生 macOS 窗口", "麦克风自动授权", "菜单栏集成"],
    },
    ios: {
      name: "iPhone / iPad",
      status: "PWA 可用",
      desc: "添加到主屏幕，获得类似原生应用的体验。无需 App Store。",
      cta: "安装教程",
      features: ["包含网页版全部功能", "主屏幕应用图标", "全屏独立运行", "离线可用"],
    },
    pwaSteps: {
      title: "安装到 iPhone / iPad",
      step1: "用 Safari 打开 kiwipennotes.com",
      step2: "点击底部的「分享」按钮",
      step3: "向下滑动，点击「添加到主屏幕」",
      step4: "点击「添加」— 完成！从主屏幕打开即可。",
    },
    macSteps: {
      title: "macOS 安装教程",
      subtitle: "首次打开时 macOS 可能弹出安全提示 — 这是正常的，所有非 App Store 下载的应用都需要这一步。",
      step1: "打开下载的 .dmg 文件",
      step2: "把 KiwiPenNotes 拖到「应用程序」文件夹",
      step3: "打开「应用程序」，找到 KiwiPenNotes，右键点击（或 Control+点击）",
      step4: "在菜单中选择「打开」",
      step5: "在弹出的对话框中点击「打开」— 完成！以后就可以正常打开了。",
      note: "这是一次性操作。首次打开后，以后双击即可正常启动。",
      whyTitle: "为什么会这样？",
      whyDesc: "macOS 会保护你免受不明来源应用的侵害。这是打开非 App Store 应用的标准操作。很多知名软件（Homebrew、OBS 等）首次打开时都需要这一步。",
    },
    sysReq: "系统要求",
    webReq: ["Chrome 90+ 或 Edge 90+", "麦克风权限"],
    macReq: ["macOS 13 Ventura 或更高", "Apple Silicon 或 Intel"],
    iosReq: ["iOS / iPadOS 16.4+", "Safari 浏览器"],
  },
};

export default function DownloadPage() {
  const { locale } = useLocale();
  const t = text[locale];
  const [platform, setPlatform] = useState<Platform>("web");
  const [showPwaGuide, setShowPwaGuide] = useState(false);
  const [showMacGuide, setShowMacGuide] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-slate-400">{t.subtitle}</p>
      </div>

      {/* Detected platform hint */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {t.detected} {t.deviceNames[platform]}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* ── Web Card ── */}
        <div
          className={`rounded-xl p-8 text-center transition-all ${
            platform === "web"
              ? "border-2 border-blue-500/50 bg-slate-800/80 ring-2 ring-blue-500/20"
              : "border border-slate-700 bg-slate-800/40"
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <Chrome className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold mb-1">{t.web.name}</h2>
          <p className="text-green-400 text-sm font-medium mb-4">{t.web.status}</p>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">{t.web.desc}</p>
          <a
            href="/record"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition w-full justify-center"
          >
            {t.web.cta}
            <ChevronRight className="w-4 h-4" />
          </a>
          <div className="mt-4 space-y-2">
            {t.web.features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-slate-400">
                <Check className="w-3 h-3 text-green-400 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* ── macOS Card ── */}
        <div
          className={`rounded-xl p-8 text-center transition-all ${
            platform === "macos"
              ? "border-2 border-green-500/50 bg-slate-800/80 ring-2 ring-green-500/20"
              : "border border-slate-700 bg-slate-800/40"
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
            <Monitor className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold mb-1">{t.macos.name}</h2>
          <p className="text-green-400 text-sm font-medium mb-4">{t.macos.status}</p>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">{t.macos.desc}</p>
          <div className="space-y-2">
            <a
              href={DMG_ARM64}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition w-full justify-center"
            >
              <Download className="w-4 h-4" />
              {t.macos.ctaAppleSilicon}
            </a>
            <a
              href={DMG_INTEL}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition w-full justify-center"
            >
              {t.macos.ctaIntel}
            </a>
          </div>
          <button
            onClick={() => setShowMacGuide(true)}
            className="mt-3 text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 transition"
          >
            <ShieldAlert className="w-3 h-3 inline mr-1" />
            {locale === "zh" ? "首次打开遇到问题？" : "First time opening? See guide"}
          </button>
          <div className="mt-4 space-y-2">
            {t.macos.features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-slate-400">
                <Check className="w-3 h-3 text-green-400 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* ── iOS Card ── */}
        <div
          className={`rounded-xl p-8 text-center transition-all ${
            platform === "ios"
              ? "border-2 border-green-500/50 bg-slate-800/80 ring-2 ring-green-500/20"
              : "border border-slate-700 bg-slate-800/40"
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold mb-1">{t.ios.name}</h2>
          <p className="text-green-400 text-sm font-medium mb-4">{t.ios.status}</p>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">{t.ios.desc}</p>
          <button
            onClick={() => setShowPwaGuide(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition w-full justify-center"
          >
            {t.ios.cta}
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="mt-4 space-y-2">
            {t.ios.features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-slate-400">
                <Check className="w-3 h-3 text-green-400 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── macOS Install Guide ── */}
      {(showMacGuide || platform === "macos") && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-8 mb-10 max-w-xl mx-auto">
          <h3 className="text-lg font-semibold mb-2 text-center">{t.macSteps.title}</h3>
          <p className="text-xs text-slate-400 text-center mb-6">{t.macSteps.subtitle}</p>
          <div className="space-y-4">
            {[
              t.macSteps.step1,
              t.macSteps.step2,
              t.macSteps.step3,
              t.macSteps.step4,
              t.macSteps.step5,
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 2 ? "bg-amber-500/30 text-amber-300 ring-2 ring-amber-500/50" : "bg-amber-500/15 text-amber-400"
                }`}>
                  {i + 1}
                </span>
                <p className={`text-sm pt-0.5 ${i === 2 ? "text-amber-200 font-medium" : "text-slate-300"}`}>
                  {step}
                </p>
              </div>
            ))}
          </div>

          {/* Visual hint */}
          <div className="mt-5 flex items-center justify-center gap-2 text-slate-500 text-xs">
            <MousePointer className="w-4 h-4" />
            <span>{locale === "zh" ? "右键" : "Right-click"}</span>
            <span>→</span>
            <span>{locale === "zh" ? "「打开」" : "\"Open\""}</span>
            <span>→</span>
            <span>{locale === "zh" ? "「打开」" : "\"Open\""}</span>
            <span>→ 🎉</span>
          </div>

          {/* One-time note */}
          <div className="mt-5 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-green-400 text-center font-medium">{t.macSteps.note}</p>
          </div>

          {/* Why explanation */}
          <details className="mt-4 text-xs text-slate-500">
            <summary className="cursor-pointer hover:text-slate-400 transition">{t.macSteps.whyTitle}</summary>
            <p className="mt-2 leading-relaxed">{t.macSteps.whyDesc}</p>
          </details>
        </div>
      )}

      {/* ── PWA Install Guide ── */}
      {(showPwaGuide || platform === "ios") && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-8 mb-10 max-w-xl mx-auto">
          <h3 className="text-lg font-semibold mb-6 text-center">{t.pwaSteps.title}</h3>
          <div className="space-y-4">
            {[t.pwaSteps.step1, t.pwaSteps.step2, t.pwaSteps.step3, t.pwaSteps.step4].map(
              (step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-300 pt-0.5">{step}</p>
                </div>
              )
            )}
          </div>
          <div className="mt-6 flex items-center justify-center gap-3 text-slate-500 text-xs">
            <Share className="w-4 h-4" />
            <span>→</span>
            <Plus className="w-4 h-4" />
            <span>→ 🎉</span>
          </div>
        </div>
      )}

      {/* ── System Requirements ── */}
      <div className="mt-16 text-center">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          {t.sysReq}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-500 max-w-3xl mx-auto">
          <div>
            <p className="text-slate-300 font-medium mb-1">Web</p>
            {t.webReq.map((r) => (
              <p key={r}>{r}</p>
            ))}
          </div>
          <div>
            <p className="text-slate-300 font-medium mb-1">macOS</p>
            {t.macReq.map((r) => (
              <p key={r}>{r}</p>
            ))}
          </div>
          <div>
            <p className="text-slate-300 font-medium mb-1">iOS</p>
            {t.iosReq.map((r) => (
              <p key={r}>{r}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
