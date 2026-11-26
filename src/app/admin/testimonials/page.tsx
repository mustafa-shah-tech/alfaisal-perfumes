'use client';

import { useState, useEffect } from 'react';
import { getTestimonials, addDocument, updateDocument, deleteDocument } from '@/lib/firestore';
import { Testimonial } from '@/types';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

const EMPTY_TESTIMONIAL: Omit<Testimonial, 'id'> = {
  name: '',
  role: '',
  company: '',
  text: '',
  imageUrl: '',
  visible: true,
  sortOrder: 1,
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Testimonial, 'id'>>(EMPTY_TESTIMONIAL);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials(false);
      setItems(data);
    } catch (err) {
      console.warn('Load testimonials error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_TESTIMONIAL, sortOrder: items.length + 1 });
    setIsEditing(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      role: item.role || '',
      company: item.company || '',
      text: item.text,
      imageUrl: item.imageUrl || '',
      visible: item.visible !== false,
      sortOrder: item.sortOrder || 1,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.text.trim()) return;

    setSaving(true);
    setToast('');

    try {
      if (editingId) {
        await updateDocument('testimonials', editingId, formData);
        setToast(`Testimonial from "${formData.name}" updated!`);
      } else {
        await addDocument('testimonials', formData);
        setToast(`Testimonial from "${formData.name}" added!`);
      }
      setIsEditing(false);
      await loadData();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Save testimonial error:', err);
      setToast('Failed to save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDocument('testimonials', deleteTarget.id);
      setToast(`Deleted testimonial from "${deleteTarget.name}".`);
      setDeleteTarget(null);
      await loadData();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Client Testimonials
          </h2>
          <p className="text-xs text-[#6B6459]">
            Manage client reviews and trust quotes displayed on the website.
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#B08D57] hover:bg-[#8F6F3E] shadow-sm transition-colors"
          >
            + Add Testimonial
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
              {editingId ? 'Edit Testimonial' : 'New Testimonial'}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kamran Siddiqui"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Role / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Founder"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Brand / Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Siddiqui Apparel"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                Testimonial Quote <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="What the business owner said about Alfaisal Perfumes..."
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.visible}
                  onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                  className="rounded border-[#E3DACB] text-[#B08D57] focus:ring-[#B08D57]"
                />
                Visible on Public Site
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
                {saving ? 'Saving...' : editingId ? 'Update Testimonial' : 'Save Testimonial'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#E3DACB] p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <p className="text-xs text-[#6B6459] italic leading-relaxed mb-4">
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="border-t border-[#E3DACB]/60 pt-3">
                <p className="font-serif font-bold text-sm text-[#1A1A1A]">{item.name}</p>
                <p className="text-[11px] text-[#B08D57]">
                  {[item.role, item.company].filter(Boolean).join(' • ')}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E3DACB]/60 flex items-center justify-between">
              <span className="text-[11px] text-[#6B6459]">
                {item.visible !== false ? '● Visible' : '○ Hidden'}
              </span>
              <div className="space-x-3">
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
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Testimonial?"
        message={`Are you sure you want to delete the testimonial from "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
        isDestructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
