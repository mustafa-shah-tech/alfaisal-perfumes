'use client';

import { useState, useEffect } from 'react';
import { getInquiries, updateDocument, deleteDocument } from '@/lib/firestore';
import { Inquiry, InquiryStatus } from '@/types';
import { INQUIRY_STATUSES } from '@/lib/constants';
import { formatDate, inquiriesToCSV, downloadFile } from '@/lib/utils';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [toast, setToast] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getInquiries();
      setInquiries(data);
    } catch (err) {
      console.warn('Error loading inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectInquiry = async (item: Inquiry) => {
    setSelectedInquiry(item);
    setNotesDraft(item.notes || '');

    // Auto mark as read if not already read
    if (!item.read) {
      try {
        await updateDocument('inquiries', item.id, { read: true });
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === item.id ? { ...inq, read: true } : inq))
        );
      } catch (err) {
        console.warn('Could not mark inquiry read:', err);
      }
    }
  };

  const handleStatusChange = async (newStatus: InquiryStatus) => {
    if (!selectedInquiry) return;
    try {
      await updateDocument('inquiries', selectedInquiry.id, { status: newStatus });
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === selectedInquiry.id ? { ...inq, status: newStatus } : inq))
      );
      setToast(`Status updated to "${newStatus}"`);
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    try {
      await updateDocument('inquiries', selectedInquiry.id, { notes: notesDraft.trim() });
      setSelectedInquiry({ ...selectedInquiry, notes: notesDraft.trim() });
      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === selectedInquiry.id ? { ...inq, notes: notesDraft.trim() } : inq
        )
      );
      setToast('Internal notes saved.');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Save notes error:', err);
    }
  };

  const handleToggleRead = async (item: Inquiry, e: React.MouseEvent) => {
    e.stopPropagation();
    const newRead = !item.read;
    try {
      await updateDocument('inquiries', item.id, { read: newRead });
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === item.id ? { ...inq, read: newRead } : inq))
      );
      if (selectedInquiry?.id === item.id) {
        setSelectedInquiry({ ...selectedInquiry, read: newRead });
      }
    } catch (err) {
      console.warn('Toggle read error:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDocument('inquiries', deleteTarget.id);
      if (selectedInquiry?.id === deleteTarget.id) {
        setSelectedInquiry(null);
      }
      setInquiries((prev) => prev.filter((inq) => inq.id !== deleteTarget.id));
      setToast('Inquiry removed.');
      setDeleteTarget(null);
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Delete inquiry error:', err);
    }
  };

  const handleExportCSV = () => {
    const csvData = inquiriesToCSV(inquiries as unknown as Array<Record<string, unknown>>);
    downloadFile(csvData, `alfaisal_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    if (statusFilter !== 'All' && inq.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = inq.fullName?.toLowerCase().includes(q);
      const matchBrand = inq.businessName?.toLowerCase().includes(q);
      const matchEmail = inq.email?.toLowerCase().includes(q);
      const matchPhone = inq.phone?.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Quote Inquiries Inbox
          </h2>
          <p className="text-xs text-[#6B6459]">
            Manage incoming quote submissions, update statuses, and log internal notes.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCSV}
          disabled={inquiries.length === 0}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] bg-white border border-[#E3DACB] hover:bg-[#FAF7F2] shadow-sm disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-[#B08D57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV ({inquiries.length})
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 animate-fadeIn">
          {toast}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E3DACB] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', ...INQUIRY_STATUSES].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#B08D57] text-white shadow-sm'
                  : 'text-[#6B6459] hover:bg-[#FAF7F2]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search name, brand, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E3DACB] text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#B08D57]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E3DACB] shadow-sm">
          {filteredInquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#E3DACB] text-[#6B6459] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Brand</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3DACB]/60">
                  {filteredInquiries.map((inq) => {
                    const isSelected = selectedInquiry?.id === inq.id;
                    return (
                      <tr
                        key={inq.id}
                        onClick={() => handleSelectInquiry(inq)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#B08D57]/10'
                            : inq.read
                            ? 'hover:bg-[#FAF7F2]/60'
                            : 'bg-amber-50/50 hover:bg-amber-50 font-semibold'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            {!inq.read ? (
                              <span
                                className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0"
                                title="Unread inquiry"
                              />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-transparent flex-shrink-0" />
                            )}
                            <div>
                              <p className="text-[#1A1A1A]">{inq.fullName}</p>
                              <p className="text-[11px] text-[#6B6459] font-normal">
                                {inq.phone || inq.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-[#6B6459]">
                          {inq.businessName || '—'}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFE8DC] text-[#1A1A1A]">
                            {inq.status || 'New'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[#6B6459] text-[11px]">
                          {inq.createdAt ? formatDate(inq.createdAt) : 'Recent'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-[#6B6459]">
              {loading ? 'Loading inquiries...' : 'No inquiries found matching your filters.'}
            </div>
          )}
        </div>

        {/* Detail Inspector Column */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E3DACB] shadow-sm sticky top-24">
          {selectedInquiry ? (
            <div className="space-y-6">
              {/* Header and status dropdown */}
              <div className="flex items-start justify-between border-b border-[#E3DACB] pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
                    {selectedInquiry.fullName}
                  </h3>
                  <p className="text-xs text-[#B08D57] font-semibold">
                    {selectedInquiry.businessName || 'Independent Entrepreneur'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleToggleRead(selectedInquiry, e)}
                    className="p-1.5 rounded-lg text-xs text-[#6B6459] hover:bg-[#FAF7F2]"
                    title={selectedInquiry.read ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    {selectedInquiry.read ? '✉ Mark Unread' : '✔ Read'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(selectedInquiry)}
                    className="p-1.5 rounded-lg text-xs text-red-600 hover:bg-red-50"
                    title="Delete inquiry"
                  >
                    🗑
                  </button>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6459] mb-1.5">
                  Inquiry Pipeline Status
                </label>
                <select
                  value={selectedInquiry.status || 'New'}
                  onChange={(e) => handleStatusChange(e.target.value as InquiryStatus)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-[#E3DACB] bg-[#FAF7F2] text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
                >
                  {INQUIRY_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      Status: {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Info Badges */}
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#FAF7F2] rounded-xl flex items-center justify-between">
                  <span className="text-[#6B6459]">Phone / WhatsApp:</span>
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#B08D57] hover:underline"
                  >
                    {selectedInquiry.phone} ↗
                  </a>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl flex items-center justify-between">
                  <span className="text-[#6B6459]">Email Address:</span>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="font-semibold text-[#B08D57] hover:underline truncate max-w-[200px]"
                  >
                    {selectedInquiry.email} ↗
                  </a>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl flex items-center justify-between">
                  <span className="text-[#6B6459]">Target Batch Size:</span>
                  <span className="font-semibold text-[#1A1A1A]">
                    {selectedInquiry.quantity || 'Not specified'}
                  </span>
                </div>
              </div>

              {/* Selected Fragrances */}
              {selectedInquiry.fragrances && selectedInquiry.fragrances.length > 0 && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6459] mb-1.5">
                    Requested Fragrance Formulations
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInquiry.fragrances.map((frag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full text-[11px] bg-[#EFE8DC] text-[#1A1A1A] font-medium"
                      >
                        {frag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Message from client */}
              {selectedInquiry.message && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6459] mb-1.5">
                    Client Vision & Message
                  </label>
                  <div className="p-3 bg-[#FAF7F2] rounded-xl text-xs text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                </div>
              )}

              {/* Internal Notes Field */}
              <div className="space-y-2 border-t border-[#E3DACB] pt-4">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6459]">
                    Internal Staff Notes
                  </label>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="text-xs font-semibold text-[#B08D57] hover:underline"
                  >
                    Save Notes
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder="Record quote amounts in PKR, sample tracking numbers, or follow-up notes..."
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E3DACB] text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#B08D57]"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-xs text-[#6B6459]">
              Select an inquiry on the left to inspect details, respond, or record staff notes.
            </div>
          )}
        </div>
      </div>

      {/* Delete dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Inquiry Record?"
        message={`Are you sure you want to permanently delete the inquiry from "${deleteTarget?.fullName}"?`}
        confirmLabel="Delete Record"
        isDestructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
