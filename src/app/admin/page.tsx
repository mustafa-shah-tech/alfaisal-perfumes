'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getInquiries, getFragrances, getPortfolio } from '@/lib/firestore';
import { Inquiry, Fragrance, PortfolioItem } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [fragrances, setFragrances] = useState<Fragrance[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [inqData, fragData, portData] = await Promise.all([
          getInquiries(),
          getFragrances(false),
          getPortfolio(false),
        ]);
        setInquiries(inqData);
        setFragrances(fragData);
        setPortfolio(portData);
      } catch (err) {
        console.warn('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const unreadInquiries = inquiries.filter((i) => !i.read);
  const recentInquiries = inquiries.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B08D57]">
            Management Overview
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] mt-1">
            Welcome to Alfaisal Perfumes
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6459] mt-1">
            Review incoming quote submissions, update catalog fragrances, and manage your private-label website.
          </p>
        </div>
        <Link
          href="/admin/inquiries"
          className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-[#B08D57] hover:bg-[#8F6F3E] transition-colors whitespace-nowrap shadow-sm"
        >
          View All Inquiries →
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Inquiries */}
        <div className="bg-white p-6 rounded-2xl border border-[#E3DACB] shadow-sm">
          <span className="text-xs font-semibold text-[#6B6459] uppercase tracking-wider block mb-1">
            Total Inquiries
          </span>
          <span className="font-serif text-4xl font-bold text-[#1A1A1A]">
            {loading ? '...' : inquiries.length}
          </span>
          <span className="text-[11px] text-[#6B6459] block mt-1">
            Quote consultation requests
          </span>
        </div>

        {/* Unread Inquiries */}
        <div className="bg-white p-6 rounded-2xl border border-[#E3DACB] shadow-sm">
          <span className="text-xs font-semibold text-[#6B6459] uppercase tracking-wider block mb-1">
            New / Unread
          </span>
          <span className="font-serif text-4xl font-bold text-red-600">
            {loading ? '...' : unreadInquiries.length}
          </span>
          <span className="text-[11px] text-[#6B6459] block mt-1">
            Awaiting response
          </span>
        </div>

        {/* Active Fragrances */}
        <div className="bg-white p-6 rounded-2xl border border-[#E3DACB] shadow-sm">
          <span className="text-xs font-semibold text-[#6B6459] uppercase tracking-wider block mb-1">
            Fragrance Library
          </span>
          <span className="font-serif text-4xl font-bold text-[#1A1A1A]">
            {loading ? '...' : fragrances.length}
          </span>
          <span className="text-[11px] text-[#6B6459] block mt-1">
            Active formulations
          </span>
        </div>

        {/* Portfolio Showcase */}
        <div className="bg-white p-6 rounded-2xl border border-[#E3DACB] shadow-sm">
          <span className="text-xs font-semibold text-[#6B6459] uppercase tracking-wider block mb-1">
            Portfolio Brands
          </span>
          <span className="font-serif text-4xl font-bold text-[#1A1A1A]">
            {loading ? '...' : portfolio.length}
          </span>
          <span className="text-[11px] text-[#6B6459] block mt-1">
            Brands displayed
          </span>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm">
        <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-6">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Inquiries Inbox', href: '/admin/inquiries', icon: '📥' },
            { label: 'Site Settings', href: '/admin/settings', icon: '⚙️' },
            { label: 'Edit Fragrances', href: '/admin/fragrances', icon: '🧴' },
            { label: 'Packaging Options', href: '/admin/packaging', icon: '📦' },
            { label: 'Home Content', href: '/admin/home-content', icon: '🏠' },
            { label: 'Theme Colors', href: '/admin/theme', icon: '🎨' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="p-4 rounded-2xl border border-[#E3DACB] hover:border-[#B08D57] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] text-center transition-all group"
            >
              <span className="text-2xl block mb-2">{action.icon}</span>
              <span className="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#B08D57] transition-colors">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Inquiries List */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
              Recent Quote Requests
            </h3>
            <p className="text-xs text-[#6B6459]">
              Latest submissions received from prospective brand owners
            </p>
          </div>
          <Link
            href="/admin/inquiries"
            className="text-xs font-semibold uppercase tracking-wider text-[#B08D57] hover:underline"
          >
            Open Inbox →
          </Link>
        </div>

        {recentInquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E3DACB] text-[#6B6459] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Brand / Company</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DACB]/60">
                {recentInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[#1A1A1A]">
                      <div className="flex items-center gap-2">
                        {!inq.read && (
                          <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" title="Unread" />
                        )}
                        <div>
                          <p className="font-semibold">{inq.fullName}</p>
                          <p className="text-[11px] text-[#6B6459]">{inq.phone || inq.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#6B6459]">{inq.businessName || '—'}</td>
                    <td className="py-3.5 px-4 text-[#6B6459]">{inq.quantity || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#B08D57]/15 text-[#8F6F3E]">
                        {inq.status || 'New'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#6B6459]">
                      {inq.createdAt ? formatDate(inq.createdAt) : 'Recent'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href="/admin/inquiries"
                        className="text-xs font-semibold text-[#B08D57] hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-[#FAF7F2]/40 rounded-2xl border border-dashed border-[#E3DACB]">
            <p className="text-xs text-[#6B6459]">
              No quote inquiries received yet. They will appear here automatically when visitors submit the contact form.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
