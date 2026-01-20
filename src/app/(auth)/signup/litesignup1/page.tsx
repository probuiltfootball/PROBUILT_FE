"use client";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch } from "@/lib/store/hooks";
import { signUp } from "@/lib/store/slices/auth.slice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import apple_vector from "@/assets/figma/Social Media Icon Square/apple_vector.png";
import google_vector from "@/assets/figma/Social Media Icon Square/google_vector.png";

const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.enum(["player", "coach"] as const),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const LiteStep1 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"player" | "coach" | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await dispatch(signUp(data)).unwrap();
      // Redirect to verify-email page with email parameter
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="mt-38 mb-16 md:mx-20 sm:mx-10 mx-8 text-(--secondary) bg-[#27272E] rounded-[30px] flex flex-col items-center p-8 md:p-12 lg:p-20 gap-6">
        <h2 className="text-4xl font-medium text-center">Create your ProBuilt Account</h2>
        <h3 className="text-xl leading-tight text-(--accent)">
          Step 1 of 4 — Getting started
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Name
            </label>
            <input
              id="full_name"
              type="text"
              {...register("full_name")}
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00FFC2] focus:outline-none transition-colors"
              placeholder="John Doe"
              aria-invalid={errors.full_name ? "true" : "false"}
            />
            {errors.full_name && (
              <span className="mt-1 text-sm text-red-400">
                {errors.full_name.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00FFC2] focus:outline-none transition-colors"
              placeholder="your@email.com"
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <span className="mt-1 text-sm text-red-400">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00FFC2] focus:outline-none transition-colors"
              placeholder="••••••••"
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <span className="mt-1 text-sm text-red-400">{errors.password.message}</span>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00FFC2] focus:outline-none transition-colors"
              placeholder="••••••••"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
            />
            {errors.confirmPassword && (
              <span className="mt-1 text-sm text-red-400">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center justify-center gap-8 mt-8">
            <span className="block">
              You’ll start on ProBuilt Lite — upgrade anytime.
            </span>
            <div className="flex items-center w-full gap-2">
              <hr className="grow border-t-2 border-(--accent)" />
              <span className="text-[--accent] font-medium">OR</span>
              <hr className="grow border-t-2 border-(--accent)" />
            </div>
            <div className="flex gap-4">
              <Link href="/apple_signup" className="hover:opacity-80 transition-opacity">
                <Image
                  src={apple_vector}
                  alt="Apple Logo"
                  className="inline-block mr-2"
                />
              </Link>
              <Link href="/google_signup" className="hover:opacity-80 transition-opacity">
                <Image src={google_vector} alt="Google Logo" className="inline-block" />
              </Link>
            </div>
            <Button variant="primary" size="lg" disabled={isLoading} type="submit">
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </div>

          {/* <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-full bg-[#00FFC2] text-black font-bold hover:bg-[#00E0AA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          ></button> */}

          {/* <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#00FFC2] hover:text-[#00E0AA] transition-colors font-medium"
            >
              Sign in
            </Link>
          </div> */}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default LiteStep1;
