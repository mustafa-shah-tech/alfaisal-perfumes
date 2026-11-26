'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageUpload from '@/components/admin/ImageUpload';

interface MediaItem {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([
    {
      id: 'm-1',
      url: '/images/placeholders/bottle.svg',
      name: 'bottle_silhouette.svg',
      uploadedAt: 'System Asset',
    },
  ]);
  const [toast, setToast] = useState('');

  const handleAddMedia = (newUrl: string) => {
    if (!newUrl) return;
    const newItem: MediaItem = {
      id: Date.now().toString(),
      url: newUrl,
      name: `upload_${Date.now()}.jpg`,
      uploadedAt: 'Just now',
    };
    setItems((prev) => [newItem, ...prev]);
    setToast('Image registered in media library!');
    setTimeout(() => setToast(''), 3000);
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setToast('URL copied to clipboard!');
    setTimeout(() => setToast(''), 2500);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setToast('Item removed from media list.');
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
          Media Asset Library
        </h2>
        <p className="text-xs text-[#6B6459]">
          Upload product photography, packaging graphics, and brand badges.
        </p>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-xs font-semibold text-green-800 animate-fadeIn">
          {toast}
        </div>
      )}

      {/* Upload Zone Card */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
          Upload New Image
        </h3>
        <ImageUpload
          label="Select or Drag Image to Upload"
          value=""
          onChange={handleAddMedia}
          folder="media_library"
        />
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-3xl p-8 border border-[#E3DACB] shadow-sm space-y-6">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
          Saved Assets ({items.length})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAF7F2] rounded-2xl border border-[#E3DACB] overflow-hidden group flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-[#EFE8DC]">
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-3 text-xs space-y-2">
                <p className="font-semibold text-[#1A1A1A] truncate">{item.name}</p>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E3DACB]">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url)}
                    className="text-[11px] font-semibold text-[#B08D57] hover:underline"
                  >
                    Copy Link
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-[11px] font-semibold text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
