import { MetadataRoute } from 'next';
import { source } from '@/lib/source';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mockrithm.me';
  const docsUrl = 'https://docs.mockrithm.me';
  const resumeUrl = 'https://resume.mockrithm.me';

  // 1. Static main marketing & game routes
  const mainRoutes = [
    '',
    '/about',
    '/contact',
    '/features',
    '/pricing',
    '/privacy-policy',
    '/refund-policy',
    '/terms',
    '/ownership-statement',
    '/games',
    '/blog'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8
  }));

  // 2. Dynamic Documentation routes (using Fumadocs source collection)
  const docsPages = source.getPages();
  const docsRoutes = docsPages.map(page => {
    const slugPath = page.url.replace(/^\/documentation/, '');
    return {
      url: `${docsUrl}${slugPath || ''}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    };
  });

  // 3. Resume onboarding route
  const resumeRoutes = [
    {
      url: resumeUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9
    }
  ];

  return [...mainRoutes, ...docsRoutes, ...resumeRoutes];
}
