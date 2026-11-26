'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUpload({
  label = 'Image',
  value,
  onChange,
  folder = 'uploads',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Check size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    // Check type
    if (!file.type.startsWith('image/')) {
      setError('Only image files (JPG, PNG, WebP, SVG) are accepted.');
      return;
    }

    try {
      setUploading(true);
      const filename = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(prog));
        },
        (err) => {
          console.error('Storage upload error:', err);
          // If storage isn't configured, read as base64 data url for preview/local usage
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              onChange(event.target.result as string);
            }
          };
          reader.readAsDataURL(file);
          setUploading(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadUrl);
          setUploading(false);
          setProgress(0);
        }
      );
    } catch (err: unknown) {
      console.warn('Fallback to local data url:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
        {label}
      </label>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

      {value ? (
        <div className="flex items-center gap-4 p-3 bg-[#FAF7F2] rounded-xl border border-[#E3DACB]">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white border border-[#E3DACB] flex-shrink-0">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#6B6459] truncate font-mono">{value}</p>
            <p className="text-[11px] text-[#B08D57] mt-0.5">Image uploaded</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#E3DACB] hover:border-[#B08D57] rounded-xl p-6 text-center cursor-pointer bg-[#FAF7F2]/50 hover:bg-[#FAF7F2] transition-colors"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {uploading ? (
              <div className="space-y-2">
                <div className="w-8 h-8 mx-auto border-2 border-[#B08D57] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium text-[#6B6459]">
                  Uploading... {progress}%
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <svg
                  className="w-8 h-8 mx-auto text-[#B08D57]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xs font-semibold text-[#1A1A1A]">
                  Click to upload image
                </p>
                <p className="text-[10px] text-[#6B6459]">
                  PNG, JPG, WebP up to 5MB
                </p>
              </div>
            )}
          </div>

          {/* Or enter custom URL toggle */}
          <div>
            {!showUrlInput ? (
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="text-[11px] text-[#B08D57] hover:underline font-medium"
              >
                + Or paste an external image URL
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#E3DACB] focus:outline-none focus:ring-1 focus:ring-[#B08D57]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customUrl.trim()) {
                      onChange(customUrl.trim());
                      setCustomUrl('');
                      setShowUrlInput(false);
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#B08D57] text-white rounded-lg hover:bg-[#8F6F3E]"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(false)}
                  className="px-2 py-1.5 text-xs text-[#6B6459]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
