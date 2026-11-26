// ============================================================
// Constants
// ============================================================

// Alternate taglines (kept as reference, editable from admin)
// "Your Brand. Our Craft."
// "From Idea to Signature Scent."

export const FRAGRANCE_FAMILIES = [
  'Floral',
  'Woody',
  'Oriental',
  'Fresh',
  'Citrus',
  'Musk',
  'Aquatic',
  'Spicy',
  'Gourmand',
] as const;

export const FRAGRANCE_GENDERS = ['Men', 'Women', 'Unisex'] as const;

export const INQUIRY_STATUSES = ['New', 'Contacted', 'Quoted', 'Won', 'Closed'] as const;

export const QUANTITY_RANGES = [
  '50 - 100 units',
  '100 - 250 units',
  '250 - 500 units',
  '500 - 1,000 units',
  '1,000 - 5,000 units',
  '5,000+ units',
  'Not sure yet',
] as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Fragrances', href: '/fragrances' },
  { label: 'Packaging', href: '/packaging' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Inquiries', href: '/admin/inquiries', icon: 'Inbox' },
  { label: 'Site Settings', href: '/admin/settings', icon: 'Settings' },
  { label: 'Theme', href: '/admin/theme', icon: 'Palette' },
  { label: 'Home Page', href: '/admin/home-content', icon: 'Home' },
  { label: 'Fragrances', href: '/admin/fragrances', icon: 'Droplets' },
  { label: 'Services', href: '/admin/services', icon: 'Briefcase' },
  { label: 'Packaging', href: '/admin/packaging', icon: 'Package' },
  { label: 'Portfolio', href: '/admin/portfolio', icon: 'FolderOpen' },
  { label: 'Testimonials', href: '/admin/testimonials', icon: 'MessageSquare' },
  { label: 'About Page', href: '/admin/about', icon: 'Info' },
  { label: 'FAQ', href: '/admin/faq', icon: 'HelpCircle' },
  { label: 'SEO', href: '/admin/seo', icon: 'Search' },
  { label: 'Media Library', href: '/admin/media', icon: 'Image' },
  { label: 'Legal Pages', href: '/admin/legal', icon: 'FileText' },
] as const;
