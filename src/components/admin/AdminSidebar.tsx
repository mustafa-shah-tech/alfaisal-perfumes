'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_NAV_LINKS } from '@/lib/constants';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  unreadInquiriesCount?: number;
}

export default function AdminSidebar({ isOpen, onClose, unreadInquiriesCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#14110F] text-[#FAF7F2] border-r border-[#2A2520] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / Brand Header */}
        <div className="p-6 border-b border-[#2A2520] flex items-center justify-between">
          <Link href="/admin" className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-[0.2em] text-[#FAF7F2]">
              ALFAISAL
            </span>
            <span className="text-[9px] tracking-[0.3em] text-[#B08D57] uppercase font-semibold">
              ADMIN CONTROL PANEL
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-[#6B6459] hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
          {ADMIN_NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;
            const isInquiries = item.href === '/admin/inquiries';

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-colors ${
                  isActive
                    ? 'bg-[#B08D57] text-white font-semibold'
                    : 'text-[#A0988D] hover:bg-[#201C19] hover:text-[#FAF7F2]'
                }`}
              >
                <span>{item.label}</span>
                {isInquiries && unreadInquiriesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white">
                    {unreadInquiriesCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Return to public website */}
        <div className="p-4 border-t border-[#2A2520]">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#D1C9BE] bg-[#201C19] hover:bg-[#2A2520] transition-colors"
          >
            <span>View Live Site</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </aside>
    </>
  );
}
