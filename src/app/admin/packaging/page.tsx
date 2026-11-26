'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getPackagingOptions, addDocument, updateDocument, deleteDocument } from '@/lib/firestore';
import { PackagingOption } from '@/types';
import ImageUpload from '@/components/admin/ImageUpload';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { placeholderImage } from '@/lib/utils';

const EMPTY_PACKAGING: Omit<PackagingOption, 'id'> = {
  title: '',
  description: '',
  imageUrl: '',
  sortOrder: 1,
  visible: true,
};

export default function AdminPackagingPage() {
  const [items, setItems] = useState<PackagingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<PackagingOption, 'id'>>(EMPTY_PACKAGING);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<PackagingOption | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getPackagingOptions(false);
      setItems(data);
    } catch (err) {
      console.warn('Load packaging error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_PACKAGING, sortOrder: items.length + 1 });
    setIsEditing(true);
  };

  const handleOpenEdit = (item: PackagingOption) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      sortOrder: item.sortOrder || 1,
      visible: item.visible !== false,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSaving(true);
    setToast('');

    try {
      if (editingId) {
        await updateDocument('packagingOptions', editingId, formData);
        setToast(`Packaging option "${formData.title}" updated!`);
      } else {
        await addDocument('packagingOptions', formData);
        setToast(`Packaging option "${formData.title}" created!`);
      }
      setIsEditing(false);
      await loadData();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Save packaging error:', err);
      setToast('Failed to save packaging option.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDocument('packagingOptions', deleteTarget.id);
      setToast(`Deleted "${deleteTarget.title}".`);
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
            Packaging & Hardware Options
          </h2>
          <p className="text-xs text-[#6B6459]">
            Manage bottle styles, caps, labels, and luxury gift boxes shown to clients.
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#B08D57] hover:bg-[#8F6F3E] shadow-sm transition-colors"
          >
            + Add Packaging Option
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
              {editingId ? 'Edit Packaging Option' : 'New Packaging Option'}
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
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Architectural Heavy-Base Glass"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Display Order
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
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Details about materials, dimensions, and finishing options..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
              />
            </div>

            <ImageUpload
              label="Hardware / Packaging Photo"
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              folder="packaging"
            />

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.visible}
                  onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                  className="rounded border-[#E3DACB] text-[#B08D57] focus:ring-[#B08D57]"
                />
                Visible on Packaging Showcase Page
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
                {saving ? 'Saving...' : editingId ? 'Update Option' : 'Create Option'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of packaging items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#E3DACB] overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] bg-[#FAF7F2]">
                <Image
                  src={item.imageUrl || placeholderImage(400, 250, item.title, 'bottle')}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6B6459] leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 border-t border-[#E3DACB]/60 flex items-center justify-between">
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
        title="Delete Packaging Option?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
        isDestructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
