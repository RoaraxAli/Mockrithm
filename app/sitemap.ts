import { MetadataRoute } from 'next';
import { source } from '@/lib/source';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mockrithm.me';
  const docsUrl = 'https://docs.mockrithm.me';

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
    // Fumadocs page.url is formatted as e.g. "/documentation/getting-started"
    // Since docs.mockrithm.me maps the subdomain to the documentation subfolder,
    // we strip "/documentation" to output absolute sitemap paths under https://docs.mockrithm.me/getting-started
    const slugPath = page.url.replace(/^\/documentation/, '');
    return {
      url: `${docsUrl}${slugPath || ''}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    };
  });

  return [...mainRoutes, ...docsRoutes];
}
