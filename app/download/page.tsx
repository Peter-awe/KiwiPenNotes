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
} from "lucide-react";
import { useLocale } from "@/lib/i18n";

type Platform = "ios" | "macos" | "web";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "web";
  const ua = navigator.userAgent;
  // iPhone or iPad (including iPadOS which reports as Mac)
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return "ios"; // iPadOS
  if (/Macintosh|Mac OS X/.test(ua)) return "macos";
  return "web";
}

const GITHUB_RELEASE_URL =
  "https://github.com/Peter-awe/KiwiPenNotes/releases/latest";

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
      status: "Coming Q2 2026",
      desc: "Native app with system audio capture. Record Zoom, Teams & any app audio.",
      cta: "Check Releases",
      features: ["Everything in Web", "System audio capture", "Offline mode", "Menu bar quick access"],
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
      step2: 'Tap the Share button',
      step3: 'Scroll down and tap "Add to Home Screen"',
      step4: 'Tap "Add" — done! Open from your Home Screen.',
    },
    notify: "Get notified when macOS launches",
    notifyDesc: "Star the GitHub repo to stay updated on releases.",
    starGithub: "Star on GitHub",
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
      status: "2026年Q2推出",
      desc: "原生应用，可录制系统音频。支持 Zoom、Teams 等任何应用。",
      cta: "查看发布",
      features: ["包含网页版全部功能", "系统音频录制", "离线模式", "菜单栏快捷访问"],
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
    notify: "macOS 版上线时通知我",
    notifyDesc: "Star GitHub 仓库获取最新发布动态。",
    starGithub: "Star GitHub",
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
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
              ? "border-2 border-amber-500/50 bg-slate-800/80 ring-2 ring-amber-500/20"
              : "border border-slate-700 bg-slate-800/40"
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-700/50 border border-slate-600 flex items-center justify-center mx-auto mb-4">
            <Monitor className="w-8 h-8 text-slate-300" />
          </div>
          <h2 className="text-xl font-semibold mb-1">{t.macos.name}</h2>
          <p className="text-amber-400 text-sm font-medium mb-4">{t.macos.status}</p>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">{t.macos.desc}</p>
          <a
            href={GITHUB_RELEASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition w-full justify-center"
          >
            {t.macos.cta}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <div className="mt-4 space-y-2">
            {t.macos.features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-slate-500">
                <Check className="w-3 h-3 text-slate-600 shrink-0" />
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

      {/* ── PWA Install Guide (shows on click or auto on iOS) ── */}
      {(showPwaGuide || platform === "ios") && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-8 mb-16 max-w-lg mx-auto">
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

      {/* ── Notify Section ── */}
      <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-8 text-center max-w-lg mx-auto">
        <h3 className="text-lg font-semibold mb-2">{t.notify}</h3>
        <p className="text-sm text-slate-400 mb-4">{t.notifyDesc}</p>
        <a
          href="https://github.com/Peter-awe/KiwiPenNotes"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          {t.starGithub}
        </a>
      </div>

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
