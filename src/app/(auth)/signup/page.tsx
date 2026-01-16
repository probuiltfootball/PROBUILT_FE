import { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { Suspense } from "react";
import signup_image from "@/assets/figma/placeholder.png";
import checkmark from "@/assets/figma/Social Media Icon Square/Check_Circle.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { sign } from "crypto";
import LiteSignupForm from "@/components/auth/LiteSignupForm";

export const metadata: Metadata = {
  title: "Sign Up - ProBuilt",
  description: "Create your ProBuilt account",
};

function SignupPageContent() {
  return (
    <div>
      <Navbar />
      <LiteSignupForm />
      <Footer />
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-white">Loading...</div>
          </div>
          <Footer />
        </div>
      }
    >
      <SignupPageContent />
    </Suspense>
  );
}
