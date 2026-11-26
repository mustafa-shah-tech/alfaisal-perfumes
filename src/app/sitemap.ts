import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://alfaisalperfumes.com';
  const lastModified = new Date();

  const routes = [
    '',
    '/services',
    '/fragrances',
    '/packaging',
    '/portfolio',
    '/about',
    '/faq',
    '/contact',
    '/privacy',
    '/terms',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route === '/contact' ? 0.9 : 0.8,
  }));
}
