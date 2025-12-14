"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SubscriptionEdgeService } from "@/lib/services/subscription-edge.service";
import { AuthService } from "@/lib/services/auth.service";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/shared/ErrorMessage";
import SuccessMessage from "@/components/shared/SuccessMessage";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">("loading");
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [resending, setResending] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const verifyEmailAndCreateTrial = async () => {
      try {
        // Get token from URL
        const token = searchParams.get("token");
        const type = searchParams.get("type");

        // If no token, show pending state with resend option
        if (!token || type !== "signup") {
          // Try to get email from URL params or session
          const emailParam = searchParams.get("email");
          if (emailParam) {
            setEmail(emailParam);
            setStatus("pending");
            setMessage("Please check your email for the verification link. If you didn't receive it, click the button below to resend.");
          } else {
          setStatus("error");
            setMessage("Invalid verification link. Please check your email for the correct verification link.");
          }
          return;
        }

        // Verify email
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "signup",
        });

        if (error) {
          setStatus("error");
          setMessage(error.message);
          return;
        }

        if (data.user) {
          // Ensure user exists in users table (required for trigger to work)
          try {
            const { data: existingUser } = await (supabase as any)
              .from('users')
              .select('id')
              .eq('id', data.user.id)
              .single();

            if (!existingUser) {
              // User doesn't exist in users table, create it
              // This will trigger auto_assign_trial() function
              const { error: insertUserError } = await (supabase as any)
                .from('users')
                .insert({
                  id: data.user.id,
                  email: data.user.email || '',
                  full_name: data.user.user_metadata?.full_name || '',
                  role: data.user.user_metadata?.role || 'player',
                });

              if (insertUserError && insertUserError.code !== '23505') {
                console.error('Failed to create user in users table:', insertUserError);
              }
            }
          } catch (userError) {
            console.error('Error checking/creating user in users table:', userError);
          }

          // Check user role
          const { data: profile } = await (supabase as any)
            .from("user_profiles")
            .select("role")
            .eq("user_id", data.user.id)
            .single();

          // Create subscription for players using new subscription system
          // All players automatically get 14-day free trial (one per unique email)
          if (profile && profile.role === "player") {
            try {
              // Wait a moment for trigger to potentially assign trial
              await new Promise(resolve => setTimeout(resolve, 1000));

              // Check if trial was already assigned by trigger
              const activePlan = await SubscriptionEdgeService.getActivePlan();

              // Auto-assign trial subscription (14 days) if no active plan exists
              // The trigger should handle this, but we ensure it's assigned here as well
              if (!activePlan.plan || activePlan.is_expired) {
                // Auto-assign trial subscription (14 days)
                await SubscriptionEdgeService.subscribePlan('trial');
              }
            } catch (subscriptionError) {
              console.error("Failed to create subscription:", subscriptionError);
              // Don't fail verification if subscription creation fails
              // The trigger should handle trial assignment as fallback
            }
          }

          setStatus("success");
          setMessage("Email verified successfully! Your 14-day trial has started.");

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        }
      } catch (err) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Verification failed");
      }
    };

    verifyEmailAndCreateTrial();
  }, [searchParams, router]);

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#2E2E2E] pt-44 md:pt-48 pb-20 top-hero-section px-4">
        <div className="max-w-md w-full">
          {status === "loading" && (
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-gray-300 mt-4">Verifying your email...</p>
            </div>
          )}

          {status === "success" && (
            <div>
              <SuccessMessage message={message} />
              <p className="text-gray-300 text-center mt-4">
                Redirecting to dashboard...
              </p>
            </div>
          )}

          {status === "pending" && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
                <p className="text-gray-300 mb-4">
                  We've sent a verification link to <strong className="text-white">{email || "your email"}</strong>
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  Please check your inbox (and spam folder) for the verification email.
                </p>
              </div>
              <button
                onClick={async () => {
                  if (!email) {
                    setMessage("Email address is required. Please try signing up again.");
                    return;
                  }
                  setResending(true);
                  try {
                    await AuthService.resendConfirmationEmail(email);
                    setMessage("Verification email sent! Please check your inbox.");
                  } catch (err) {
                    setMessage(err instanceof Error ? err.message : "Failed to resend email. Please try again.");
                  } finally {
                    setResending(false);
                  }
                }}
                disabled={resending}
                className="w-full bg-[#00FFC2] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00e6b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? "Sending..." : "Resend Verification Email"}
              </button>
              <button
                onClick={() => router.push("/login")}
                className="mt-4 w-full bg-transparent border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}

          {status === "error" && (
            <div>
              <ErrorMessage message={message} />
              {email && (
                <button
                  onClick={async () => {
                    setResending(true);
                    try {
                      await AuthService.resendConfirmationEmail(email);
                      setMessage("Verification email sent! Please check your inbox.");
                      setStatus("pending");
                    } catch (err) {
                      setMessage(err instanceof Error ? err.message : "Failed to resend email. Please try again.");
                    } finally {
                      setResending(false);
                    }
                  }}
                  disabled={resending}
                  className="mt-4 w-full bg-[#00FFC2] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00e6b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending ? "Sending..." : "Resend Verification Email"}
                </button>
              )}
              <button
                onClick={() => router.push("/login")}
                className="mt-4 w-full bg-transparent border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </main>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

