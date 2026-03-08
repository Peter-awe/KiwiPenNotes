"use client";

// ============================================================
// app/global-error.tsx — Root Layout Error Boundary
// Last line of defense: catches errors in the root layout itself
// (AuthProvider crash, nav crash, etc.)
// Must render its own <html>/<body> since the root layout failed.
// ============================================================

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void _error; // Required by Next.js error boundary signature
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">:(</div>
        <h2 className="text-xl font-semibold text-white mb-2">
          KiwiPenNotes ran into a problem
        </h2>
        <p className="text-slate-400 mb-6 max-w-md">
          Something went wrong at the application level. Please try refreshing
          the page.
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition font-medium"
          >
            Refresh
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
          >
            Home
          </a>
        </div>
      </body>
    </html>
  );
}
