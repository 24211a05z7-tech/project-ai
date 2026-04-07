'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['team_leader', 'member', 'guide', 'panel_member']),
});
type FormData = z.infer<typeof schema>;

const roleOptions = [
  { value: 'team_leader', label: 'Team Leader', desc: 'Lead and manage your project team' },
  { value: 'member', label: 'Team Member', desc: 'Collaborate on project tasks' },
  { value: 'guide', label: 'Guide / Mentor', desc: 'Mentor teams and review work' },
  { value: 'panel_member', label: 'Panel Member', desc: 'Evaluate and score projects' },
];

export default function RegisterPage() {
  const { register: ctxRegister } = useAuth();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'member' },
  });

  const selectedRole = watch('role');

  const onSubmit = async ({ name, email, password, role }: FormData) => {
    setServerError('');
    try {
      await ctxRegister(name, email, password, role);
      router.push('/dashboard');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Registration failed';
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-xl bg-primary-600 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100">ProjectFlow AI</span>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Create account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Join ProjectFlow AI today</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              leftIcon={<User size={16} />}
              error={errors.name?.message}
              {...register('name')}
            />
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

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue('role', opt.value as FormData['role'])}
                    className={`text-left p-3 rounded-xl border-2 transition-all ${
                      selectedRole === opt.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{opt.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
              {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
            </div>

            {serverError && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{serverError}</p>
            )}
            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              Create Account
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
