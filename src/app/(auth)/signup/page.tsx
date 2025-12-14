import { Metadata } from 'next';
import SignupForm from '@/components/auth/SignupForm';
import Navbar from '@/components/navbar';
import { Footer } from '@/components/footer';
import Image from 'next/image';
import SiteLogo from '@/assets/svg/site-logo.svg';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Sign Up - ProBuilt',
  description: 'Create your ProBuilt account',
};

function SignupPageContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[780px]">
          <div className="bg-[#2E2E2E] backdrop-blur-[10px] border border-[#00FFC230] rounded-xl p-8 shadow-2xl">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <Image src={SiteLogo} alt="ProBuilt Logo" width={40} height={40} />
              <h1 className="text-2xl font-bold text-white">
                ProBuilt <span className="text-[#00FFC2]">Football</span>
              </h1>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Create Account
            </h2>
            <p className="text-gray-400 text-center mb-8">
              Join ProBuilt and start your development journey
            </p>

            {/* Signup Form */}
            <SignupForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
        <Footer />
      </div>
    }>
      <SignupPageContent />
    </Suspense>
  );
}

