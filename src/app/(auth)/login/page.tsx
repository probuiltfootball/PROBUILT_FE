import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import Navbar from '@/components/navbar';
import { Footer } from '@/components/footer';
import Image from 'next/image';
import SiteLogo from '@/assets/svg/site-logo.svg';

export const metadata: Metadata = {
  title: 'Login - ProBuilt',
  description: 'Sign in to your ProBuilt account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1A1A1A]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 pt-44 md:pt-48">
        <div className="w-full max-w-md">
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
              Welcome Back
            </h2>
            <p className="text-gray-400 text-center mb-8">
              Sign in to continue your journey
            </p>

            {/* Login Form */}
            <LoginForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

