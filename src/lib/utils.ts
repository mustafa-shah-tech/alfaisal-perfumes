// ============================================================
// Utility Functions
// ============================================================
import { type ClassValue, clsx } from 'clsx';

/** Merge class names (simple clsx replacement if clsx not available) */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Build a WhatsApp URL */
export function buildWhatsAppUrl(number: string, message?: string): string {
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanNumber}`;
  if (message) {
    return `${url}?text=${encodeURIComponent(message)}`;
  }
  return url;
}

/** Format a date string for display */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Truncate text to a max length */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/** Generate a placeholder gradient SVG data URI */
export function placeholderImage(
  width = 400,
  height = 400,
  label = '',
  variant: 'bottle' | 'gradient' | 'brand' = 'gradient'
): string {
  if (variant === 'bottle') {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#EFE8DC"/>
            <stop offset="100%" style="stop-color:#E3DACB"/>
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#bg)" rx="8"/>
        <g transform="translate(${width / 2}, ${height / 2 - 30})">
          <rect x="-15" y="-60" width="30" height="20" rx="4" fill="#B08D57" opacity="0.6"/>
          <rect x="-5" y="-42" width="10" height="10" fill="#B08D57" opacity="0.5"/>
          <rect x="-25" y="-32" width="50" height="80" rx="6" fill="#B08D57" opacity="0.3"/>
          <rect x="-20" y="-28" width="40" height="72" rx="4" fill="#B08D57" opacity="0.15"/>
        </g>
        ${label ? `<text x="${width / 2}" y="${height / 2 + 70}" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" fill="#6B6459">${label}</text>` : ''}
      </svg>
    `)}`;
  }

  if (variant === 'brand') {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#14110F"/>
            <stop offset="100%" style="stop-color:#2A2520"/>
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#bg)" rx="8"/>
        <text x="${width / 2}" y="${height / 2}" text-anchor="middle" dominant-baseline="central" font-family="Cormorant Garamond, serif" font-size="20" fill="#B08D57" letter-spacing="3">${label || 'BRAND'}</text>
      </svg>
    `)}`;
  }

  // Default gradient
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#EFE8DC"/>
          <stop offset="100%" style="stop-color:#FAF7F2"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)" rx="8"/>
      ${label ? `<text x="${width / 2}" y="${height / 2}" text-anchor="middle" dominant-baseline="central" font-family="Inter, sans-serif" font-size="14" fill="#6B6459">${label}</text>` : ''}
    </svg>
  `)}`;
}

/** Convert inquiry data to CSV string */
export function inquiriesToCSV(inquiries: Array<Record<string, unknown>>): string {
  if (inquiries.length === 0) return '';
  const headers = ['Full Name', 'Business', 'Phone', 'Email', 'Fragrances', 'Quantity', 'Message', 'Status', 'Date'];
  const rows = inquiries.map((inq) => [
    inq.fullName || '',
    inq.businessName || '',
    inq.phone || '',
    inq.email || '',
    Array.isArray(inq.fragrances) ? (inq.fragrances as string[]).join('; ') : '',
    inq.quantity || '',
    String(inq.message || '').replace(/"/g, '""'),
    inq.status || '',
    inq.createdAt ? formatDate(String(inq.createdAt)) : '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

/** Download a string as a file */
export function downloadFile(content: string, filename: string, mimeType = 'text/csv') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
