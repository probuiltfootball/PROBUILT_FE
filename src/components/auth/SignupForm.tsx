'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '@/lib/store/hooks';
import { signUp } from '@/lib/store/slices/auth.slice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['player', 'coach'] as const),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'player' | 'coach' | null>(null);
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
    defaultValues: {
      role: 'player',
    },
  });

  const role = watch('role');

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await dispatch(signUp(data)).unwrap();
      // Redirect to verify-email page with email parameter
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role: 'player' | 'coach') => {
    setSelectedRole(role);
    setValue('role', role);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          I am a...
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleRoleSelect('player')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedRole === 'player' || role === 'player'
                ? 'border-[#00FFC2] bg-[#00FFC2]/10'
                : 'border-gray-600 bg-[#1A1A1A] hover:border-gray-500'
            }`}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-white mb-1">Player</div>
              <div className="text-xs text-gray-400">
                Develop your skills
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('coach')}
            disabled={true}
            className={`p-4 rounded-lg border-2 transition-all cursor-not-allowed opacity-50 ${
              selectedRole === 'coach' || role === 'coach'
                ? 'border-gray-600 bg-gray-700/50'
                : 'border-gray-700 bg-[#1A1A1A]'
            }`}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-gray-500 mb-1">Coach</div>
              <div className="text-xs text-gray-500">
                Coming soon
              </div>
            </div>
          </button>
        </div>
        <input type="hidden" {...register('role')} />
        {errors.role && (
          <span className="mt-1 text-sm text-red-400">{errors.role.message}</span>
        )}
      </div>

      {/* Info message about free trial - always visible */}
      <div className="p-4 bg-[#00FFC2]/10 border border-[#00FFC2]/30 rounded-lg">
        <p className="text-sm text-gray-300">
          <span className="text-[#00FFC2] font-semibold">🎉 Free 14-Day Trial!</span> You'll automatically get 14 days of free access to Hub Starter content after registration.
        </p>
      </div>

      <div>
        <label
          htmlFor="full_name"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Full Name
        </label>
        <input
          id="full_name"
          type="text"
          {...register('full_name')}
          className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00FFC2] focus:outline-none transition-colors"
          placeholder="John Doe"
          aria-invalid={errors.full_name ? 'true' : 'false'}
        />
        {errors.full_name && (
          <span className="mt-1 text-sm text-red-400">{errors.full_name.message}</span>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00FFC2] focus:outline-none transition-colors"
          placeholder="your@email.com"
          aria-invalid={errors.email ? 'true' : 'false'}
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
          {...register('password')}
          className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00FFC2] focus:outline-none transition-colors"
          placeholder="••••••••"
          aria-invalid={errors.password ? 'true' : 'false'}
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
          {...register('confirmPassword')}
          className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00FFC2] focus:outline-none transition-colors"
          placeholder="••••••••"
          aria-invalid={errors.confirmPassword ? 'true' : 'false'}
        />
        {errors.confirmPassword && (
          <span className="mt-1 text-sm text-red-400">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !selectedRole}
        className="w-full px-6 py-3 rounded-full bg-[#00FFC2] text-black font-bold hover:bg-[#00E0AA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </button>

      <div className="text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-[#00FFC2] hover:text-[#00E0AA] transition-colors font-medium"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}

