"use client";

import { useAppSelector } from "@/lib/store/hooks";
import Link from "next/link";

export default function HubPageCta() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/dashboard/content/hub"
          className="px-8 py-3 rounded-full bg-[#00FFC2] text-black font-semibold hover:bg-[#00E0AA] transition-colors"
        >
          Access My Hub Content
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
        className="px-8 py-3 rounded-full bg-[#00FFC2] text-black font-semibold hover:bg-[#00E0AA] transition-colors"
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

