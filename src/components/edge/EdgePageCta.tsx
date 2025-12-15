"use client";

import { useAppSelector } from "@/lib/store/hooks";
import Link from "next/link";

export default function EdgePageCta() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/dashboard/content/edge"
          className="px-8 py-3 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors"
        >
          Access My Edge Content
        </Link>
        <Link
          href="/membership"
          className="px-8 py-3 rounded-full border border-gray-500 text-white font-medium hover:border-white transition-colors"
        >
          View Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="/signup"
        className="px-8 py-3 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors"
      >
        Start Free Trial
      </Link>
      <Link
        href="/membership"
        className="px-8 py-3 rounded-full border border-gray-500 text-white font-medium hover:border-white transition-colors"
      >
        View Plans
      </Link>
    </div>
  );
}

