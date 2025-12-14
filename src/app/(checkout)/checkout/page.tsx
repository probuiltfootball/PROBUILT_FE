"use client";

import { Suspense } from "react";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import CheckoutPageContent from "@/components/checkout/CheckoutPageContent";

export default function CheckoutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <div className="pt-44 md:pt-48">
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <CheckoutPageContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}

