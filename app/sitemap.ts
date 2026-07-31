import { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { RESUME_LANDING_LIST } from '@/lib/resumeData';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mockrithm.me';
  const docsUrl = 'https://docs.mockrithm.me';
  const resumeUrl = 'https://resume.mockrithm.me';
  const gamesUrl = 'https://games.mockrithm.me';

  // 1. Static main marketing routes
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

  // 3. Resume subdomain routes — landing + all niche role pages
  const resumeNicheSlugs = Object.keys(RESUME_LANDING_LIST).filter(
    slug => slug !== 'ats-checker' // removed page
  );

  const resumeRoutes: MetadataRoute.Sitemap = [
    {
      url: resumeUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9
    },
    ...resumeNicheSlugs.map(slug => ({
      url: `${resumeUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }))
  ];

  // 4. Games subdomain routes — landing + all topic pages
  const gamesTopics = [
    'html', 'css', 'js', 'sql', 'api', 'dsa',
    'audio', 'star', 'logic', 'react', 'python',
    'devops', 'metrics', 'system', 'security'
  ];

  const gamesRoutes: MetadataRoute.Sitemap = [
    {
      url: gamesUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9
    },
    ...gamesTopics.map(topic => ({
      url: `${gamesUrl}/${topic}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }))
  ];

  return [...mainRoutes, ...docsRoutes, ...resumeRoutes, ...gamesRoutes];
}
