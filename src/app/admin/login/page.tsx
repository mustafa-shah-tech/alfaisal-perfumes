'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLoginPage() {
  const { user, login, isDemoMode } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('admin@alfaisalperfumes.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      router.push('/admin');
    } catch (err: unknown) {
      const errorObj = err as { message?: string; code?: string };
      console.error('Login error:', err);
      if (errorObj?.code === 'auth/invalid-credential' || errorObj?.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please verify your credentials.');
      } else if (errorObj?.code === 'auth/user-not-found') {
        setError('No administrator account found with this email.');
      } else {
        setError(errorObj?.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#E3DACB] shadow-xl space-y-7">
        {/* Brand header */}
        <div className="text-center">
          <Link href="/" className="inline-block group">
            <span className="font-serif text-3xl font-bold tracking-[0.2em] text-[#1A1A1A] group-hover:text-[#B08D57] transition-colors">
              ALFAISAL
            </span>
            <span className="block text-[10px] tracking-[0.35em] text-[#B08D57] uppercase font-semibold mt-1">
              PERFUMES
            </span>
          </Link>
          <div className="w-12 h-0.5 bg-[#B08D57] mx-auto mt-4 mb-3" />
          <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">
            Staff Administration Portal
          </h2>
          <p className="text-xs text-[#6B6459] mt-1">
            Sign in to manage fragrances, settings, and quote inquiries
          </p>
        </div>

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="p-4 rounded-2xl bg-[#EFE8DC]/80 border border-[#B08D57]/40 text-xs text-[#1A1A1A] space-y-1">
            <div className="flex items-center gap-2 font-semibold text-[#8F6F3E]">
              <span>✦</span>
              <span>Local Demo Preview Mode Active</span>
            </div>
            <p className="text-[11px] text-[#6B6459] leading-relaxed">
              Firebase credentials have not been added to <code className="bg-white/80 px-1 py-0.5 rounded text-[#1A1A1A]">.env.local</code> yet. You can sign in with any demo credentials to explore all admin modules.
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Admin Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@alfaisalperfumes.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] placeholder-[#6B6459]/50 focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] placeholder-[#6B6459]/50 focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest text-white bg-[#B08D57] hover:bg-[#8F6F3E] shadow-md disabled:opacity-50 transition-colors"
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Panel'}
          </button>
        </form>

        <div className="pt-2 border-t border-[#E3DACB] text-center">
          <Link
            href="/"
            className="text-xs text-[#6B6459] hover:text-[#1A1A1A] transition-colors"
          >
            ← Back to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
