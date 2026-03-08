// ============================================================
// app/not-found.tsx — Custom 404 page
// Shown when a user visits a non-existent route.
// ============================================================

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="text-6xl font-bold text-slate-600 mb-4">404</div>
      <h2 className="text-xl font-semibold text-white mb-2">Page not found</h2>
      <p className="text-slate-400 mb-6 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition font-medium"
        >
          Go home
        </Link>
        <Link
          href="/record"
          className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
        >
          Start recording
        </Link>
      </div>
    </div>
  );
}
