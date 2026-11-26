'use client';

import { useState, useEffect } from 'react';
import { getFAQs, addDocument, updateDocument, deleteDocument } from '@/lib/firestore';
import { FAQ } from '@/types';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

const EMPTY_FAQ: Omit<FAQ, 'id'> = {
  question: '',
  answer: '',
  sortOrder: 1,
  visible: true,
};

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<FAQ, 'id'>>(EMPTY_FAQ);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<FAQ | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getFAQs(false);
      setFaqs(data);
    } catch (err) {
      console.warn('Load FAQs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_FAQ, sortOrder: faqs.length + 1 });
    setIsEditing(true);
  };

  const handleOpenEdit = (item: FAQ) => {
    setEditingId(item.id);
    setFormData({
      question: item.question,
      answer: item.answer,
      sortOrder: item.sortOrder || 1,
      visible: item.visible !== false,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) return;

    setSaving(true);
    setToast('');

    try {
      if (editingId) {
        await updateDocument('faqs', editingId, formData);
        setToast('FAQ question updated!');
      } else {
        await addDocument('faqs', formData);
        setToast('New FAQ question added!');
      }
      setIsEditing(false);
      await loadData();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Save FAQ error:', err);
      setToast('Failed to save FAQ.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDocument('faqs', deleteTarget.id);
      setToast('FAQ deleted.');
      setDeleteTarget(null);
      await loadData();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            FAQ Manager
          </h2>
          <p className="text-xs text-[#6B6459]">
            Create and edit answers to common private-label perfume client inquiries.
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#B08D57] hover:bg-[#8F6F3E] shadow-sm transition-colors"
          >
            + Add FAQ Item
          </button>
        )}
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 animate-fadeIn">
          {toast}
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-[#E3DACB] pb-4">
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
              {editingId ? 'Edit FAQ Item' : 'New FAQ Item'}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs font-semibold text-[#6B6459] hover:text-[#1A1A1A]"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What is your Minimum Order Quantity (MOQ)?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Order Index
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 1 })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                Answer <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Clear, helpful response for prospective business owners..."
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.visible}
                  onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                  className="rounded border-[#E3DACB] text-[#B08D57] focus:ring-[#B08D57]"
                />
                Visible on Public FAQ Page
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E3DACB]">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#6B6459] hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-7 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#B08D57] hover:bg-[#8F6F3E] shadow-sm disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : editingId ? 'Update FAQ' : 'Save FAQ'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {faqs.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#E3DACB] p-6 shadow-sm flex items-start justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#B08D57]">
                  #{item.sortOrder}
                </span>
                <h4 className="font-serif text-lg font-bold text-[#1A1A1A]">
                  {item.question}
                </h4>
              </div>
              <p className="text-xs text-[#6B6459] leading-relaxed">
                {item.answer}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 pt-1">
              <button
                type="button"
                onClick={() => handleOpenEdit(item)}
                className="text-xs font-semibold text-[#B08D57] hover:underline"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(item)}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete FAQ?"
        message={`Are you sure you want to delete this question?`}
        confirmLabel="Delete"
        isDestructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
