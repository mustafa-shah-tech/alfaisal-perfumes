'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getFragrances, addDocument, updateDocument, deleteDocument } from '@/lib/firestore';
import { Fragrance, FragranceGender, FragranceFamily } from '@/types';
import { FRAGRANCE_FAMILIES, FRAGRANCE_GENDERS } from '@/lib/constants';
import ImageUpload from '@/components/admin/ImageUpload';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { placeholderImage } from '@/lib/utils';

const EMPTY_FRAGRANCE: Omit<Fragrance, 'id' | 'createdAt'> = {
  name: '',
  description: '',
  family: 'Woody',
  gender: 'Unisex',
  notesTop: '',
  notesHeart: '',
  notesBase: '',
  imageUrl: '',
  featured: false,
  visible: true,
  sortOrder: 1,
};

export default function AdminFragrancesPage() {
  const [fragrances, setFragrances] = useState<Fragrance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Fragrance, 'id' | 'createdAt'>>(EMPTY_FRAGRANCE);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Fragrance | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getFragrances(false); // false = all including invisible
      setFragrances(data);
    } catch (err) {
      console.warn('Error loading fragrances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...EMPTY_FRAGRANCE,
      sortOrder: fragrances.length + 1,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (frag: Fragrance) => {
    setEditingId(frag.id);
    setFormData({
      name: frag.name || '',
      description: frag.description || '',
      family: frag.family || 'Woody',
      gender: frag.gender || 'Unisex',
      notesTop: frag.notesTop || '',
      notesHeart: frag.notesHeart || '',
      notesBase: frag.notesBase || '',
      imageUrl: frag.imageUrl || '',
      featured: !!frag.featured,
      visible: frag.visible !== false,
      sortOrder: frag.sortOrder || 1,
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    setToast('');

    try {
      if (editingId) {
        await updateDocument('fragrances', editingId, formData);
        setToast(`Fragrance "${formData.name}" updated successfully!`);
      } else {
        await addDocument('fragrances', formData);
        setToast(`Fragrance "${formData.name}" added to library!`);
      }
      setIsEditing(false);
      await loadData();
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      console.error('Save fragrance error:', err);
      setToast('Failed to save fragrance.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDocument('fragrances', deleteTarget.id);
      setToast(`Deleted "${deleteTarget.name}".`);
      setDeleteTarget(null);
      await loadData();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setToast('Failed to delete fragrance.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Fragrance Formulation Library
          </h2>
          <p className="text-xs text-[#6B6459]">
            Add, update, and manage scents available for private-label clients.
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#B08D57] hover:bg-[#8F6F3E] shadow-sm transition-colors"
          >
            + Add New Fragrance
          </button>
        )}
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 animate-fadeIn">
          {toast}
        </div>
      )}

      {/* Add / Edit Form Modal / Card */}
      {isEditing && (
        <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-md space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#E3DACB] pb-4">
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
              {editingId ? 'Edit Fragrance Formulation' : 'Create New Fragrance'}
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
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Fragrance Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midnight Amber Oud"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
                />
              </div>

              {/* Sort Order */}
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

            {/* Gender & Family */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Target Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value as FragranceGender })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
                >
                  {FRAGRANCE_GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Fragrance Family
                </label>
                <select
                  value={formData.family}
                  onChange={(e) =>
                    setFormData({ ...formData, family: e.target.value as FragranceFamily })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
                >
                  {FRAGRANCE_FAMILIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Olfactory Notes Pyramid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Top Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bergamot, Pink Pepper"
                  value={formData.notesTop}
                  onChange={(e) => setFormData({ ...formData, notesTop: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-[#E3DACB] text-xs text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Heart / Middle Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bulgarian Rose, Oud"
                  value={formData.notesHeart}
                  onChange={(e) => setFormData({ ...formData, notesHeart: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-[#E3DACB] text-xs text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                  Base Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Golden Amber, Tonka Bean"
                  value={formData.notesBase}
                  onChange={(e) => setFormData({ ...formData, notesBase: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-[#E3DACB] text-xs text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
                Fragrance Profile & Description
              </label>
              <textarea
                rows={3}
                placeholder="Evocative description of this fragrance formulation..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E3DACB] text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
              />
            </div>

            {/* Image Upload */}
            <ImageUpload
              label="Bottle / Formulation Image"
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              folder="fragrances"
            />

            {/* Featured & Visible Toggles */}
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-[#E3DACB] text-[#B08D57] focus:ring-[#B08D57]"
                />
                Featured on Homepage
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.visible}
                  onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                  className="rounded border-[#E3DACB] text-[#B08D57] focus:ring-[#B08D57]"
                />
                Published & Visible to Public
              </label>
            </div>

            {/* Buttons */}
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
                {saving ? 'Saving...' : editingId ? 'Update Fragrance' : 'Create Fragrance'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Fragrances Table List */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
            Catalog Formulations ({fragrances.length})
          </h3>
          <span className="text-xs text-[#6B6459]">
            {fragrances.filter((f) => f.visible).length} Published
          </span>
        </div>

        {fragrances.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E3DACB] text-[#6B6459] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Family</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4">Visibility</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DACB]/60">
                {fragrances.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#FAF7F2] border border-[#E3DACB]">
                        <Image
                          src={item.imageUrl || placeholderImage(100, 100, item.name, 'bottle')}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1A1A1A]">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-[#6B6459]">{item.family}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFE8DC] text-[#1A1A1A]">
                        {item.gender}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.featured ? (
                        <span className="text-[#B08D57] font-semibold">★ Yes</span>
                      ) : (
                        <span className="text-[#A0988D]">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {item.visible !== false ? (
                        <span className="text-green-700 font-medium">● Visible</span>
                      ) : (
                        <span className="text-gray-400 font-medium">○ Hidden</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-xs text-[#6B6459]">
            {loading ? 'Loading fragrance database...' : 'No fragrances found. Click "+ Add New Fragrance" to create your first scent.'}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Fragrance Formulation?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Fragrance"
        isDestructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
