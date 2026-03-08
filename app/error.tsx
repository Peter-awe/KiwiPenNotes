"use client";

// ============================================================
// app/error.tsx — Route-level Error Boundary
// Catches runtime errors within <main>{children}</main>,
// prevents white-screen in production.
// The root layout (nav, AuthProvider) stays visible.
// ============================================================

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uncaught error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="text-5xl mb-4">:(</div>
      <h2 className="text-xl font-semibold text-white mb-2">
        Something went wrong
      </h2>
      <p className="text-slate-400 mb-6 max-w-md">
        An unexpected error occurred. You can try again, or go back to the home
        page.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition font-medium"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
        >
          Home
        </a>
      </div>
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-8 p-4 bg-slate-800 rounded-lg text-left text-sm text-red-400 max-w-2xl overflow-auto">
          {error.message}
          {"\n"}
          {error.stack}
        </pre>
      )}
    </div>
  );
}
