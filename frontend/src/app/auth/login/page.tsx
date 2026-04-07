'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email, password }: FormData) => {
    setServerError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Invalid credentials';
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 flex-col items-center justify-center p-12 text-white">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Sparkles size={28} />
          </div>
          <span className="text-3xl font-bold">ProjectFlow AI</span>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4">Manage projects smarter</h2>
        <p className="text-primary-100 text-center max-w-sm">
          AI-powered tools for academic teams — track tasks, review documents, and measure performance all in one place.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
          {[
            { label: 'AI Suggestions', desc: 'Smart task breakdowns' },
            { label: 'Real-time Sync', desc: 'Live team collaboration' },
            { label: 'Document Review', desc: 'Automated scoring' },
            { label: 'Performance', desc: 'Gamified leaderboard' },
          ].map(f => (
            <div key={f.label} className="bg-white/10 rounded-xl p-3">
              <p className="font-semibold text-sm">{f.label}</p>
              <p className="text-xs text-primary-200 mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">ProjectFlow AI</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-7">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button type="button" onClick={() => setShowPass(v => !v)} className="cursor-pointer">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />
            {serverError && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{serverError}</p>
            )}
            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-primary-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
