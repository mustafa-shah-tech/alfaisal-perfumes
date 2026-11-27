'use client';

import { useAuth } from '@/contexts/AuthContext';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle?: () => void;
}

export default function AdminHeader({ title, subtitle, onMenuToggle }: AdminHeaderProps) {
  const { user, logout, isDemoMode } = useAuth();

  return (
    <header className="bg-white border-b border-[#E3DACB] sticky top-0 z-30 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#1A1A1A] hover:bg-[#EFE8DC] flex-shrink-0"
            aria-label="Toggle admin sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div className="min-w-0">
          <h1 className="font-serif text-lg sm:text-2xl font-bold text-[#1A1A1A] truncate">{title}</h1>
          {subtitle && <p className="hidden sm:block text-xs text-[#6B6459] truncate">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        <div className="hidden md:flex flex-col text-right">
          <span className="text-xs font-semibold text-[#1A1A1A]">
            {user?.email || 'Admin Staff'}
          </span>
          <span className="text-[10px] text-[#B08D57] font-medium uppercase tracking-wider">
            {isDemoMode ? 'Preview Mode' : 'Live Connected'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          className="px-3 sm:px-4 py-2 min-h-[40px] rounded-lg text-xs font-semibold uppercase tracking-wider border border-[#E3DACB] hover:bg-[#FAF7F2] text-[#6B6459] hover:text-[#1A1A1A] transition-colors whitespace-nowrap"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
