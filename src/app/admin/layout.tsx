'use client';

import { useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { getInquiries } from '@/lib/firestore';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isLoginPage = pathname === '/admin/login';

  // Guard protected admin routes
  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [user, loading, isLoginPage, router]);

  // Fetch unread inquiries count
  useEffect(() => {
    if (user && !isLoginPage) {
      async function loadCount() {
        try {
          const list = await getInquiries();
          const unread = list.filter((item) => !item.read).length;
          setUnreadCount(unread);
        } catch (err) {
          console.warn('Could not load unread count:', err);
        }
      }
      loadCount();
    }
  }, [user, isLoginPage, pathname]);

  // If on login page, render children directly
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#B08D57] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6459]">
            Verifying Admin Access...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, return null while redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        unreadInquiriesCount={unreadCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <AdminHeader
          title="Alfaisal Perfumes Admin"
          subtitle="Manage website content, fragrances, and quote inquiries"
          onMenuToggle={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
