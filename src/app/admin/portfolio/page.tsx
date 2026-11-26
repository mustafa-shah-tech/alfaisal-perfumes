'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getPortfolio, addDocument, updateDocument, deleteDocument } from '@/lib/firestore';
import { PortfolioItem } from '@/types';
import ImageUpload from '@/components/admin/ImageUpload';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { placeholderImage } from '@/lib/utils';

const EMPTY_PORTFOLIO: Omit<PortfolioItem, 'id'> = {
  brandName: '',
  description: '',
  imageUrl: '',
  sortOrder: 1,
  visible: true,
};

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<PortfolioItem, 'id'>>(EMPTY_PORTFOLIO);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getPortfolio(false);
      setItems(data);
    } catch (err) {
      console.warn('Load portfolio error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_PORTFOLIO, sortOrder: items.length + 1 });
    setIsEditing(true);
  };

  const handleOpenEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setFormData({
      brandName: item.brandName,
      description: item.description,
      imageUrl: item.imageUrl,
      sortOrder: item.sortOrder || 1,
      visible: item.visible !== false,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandName.trim()) return;

    setSaving(true);
    setToast('');

    try {
      if (editingId) {
        await updateDocument('portfolio', editingId, formData);
        setToast(`Brand "${formData.brandName}" updated!`);
      } else {
        await addDocument('portfolio', formData);
        setToast(`Brand "${formData.brandName}" added!`);
      }
      setIsEditing(false);
      await loadData();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Save portfolio error:', err);
      setToast('Failed to save brand.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDocument('portfolio', deleteTarget.id);
      setToast(`Deleted "${deleteTarget.brandName}".`);
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
            Portfolio Brands Showcase
          </h2>
          <p className="text-xs text-[#6B6459]">
            Showcase private-label brands and client case studies built by Alfaisal.
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#B08D57] hover:bg-[#8F6F3E] shadow-sm transition-colors"
          >
            + Add Client Brand
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
              {editingId ? 'Edit Brand Showcase' : 'Add New Client Brand'}
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
                  Brand / Collection Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nocturne Atelier"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Sort Order
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
                Case Study Description
              </label>
              <textarea
                rows={3}
                placeholder="Details of client, flacon styling, and fragrance character..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
              />
            </div>

            <ImageUpload
              label="Brand Showcase Image"
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              folder="portfolio"
            />

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.visible}
                  onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                  className="rounded border-[#E3DACB] text-[#B08D57] focus:ring-[#B08D57]"
                />
                Visible in Brands We’ve Built Showcase
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
                {saving ? 'Saving...' : editingId ? 'Update Brand' : 'Save Brand'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of portfolio brands */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#E3DACB] overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] bg-[#14110F]">
                <Image
                  src={item.imageUrl || placeholderImage(500, 300, item.brandName, 'brand')}
                  alt={item.brandName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-2">
                  {item.brandName}
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
        title="Delete Brand Case Study?"
        message={`Are you sure you want to delete "${deleteTarget?.brandName}"?`}
        confirmLabel="Delete"
        isDestructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
