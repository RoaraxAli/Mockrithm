import { type BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: 'Mockrithm Docs',
  },
  links: [
    {
      text: 'Website',
      url: 'https://mockrithm.me',
      active: 'nested-url',
    },
  ],
};

export const docsOptions = {
  ...baseOptions,
  tabs: [
    {
      title: 'User Manual',
      description: 'Learn how to use Mockrithm',
      url: '/docs/user',
    },
    {
      title: 'Developer Docs',
      description: 'API and system architecture documentation',
      url: '/docs/dev',
    },
  ],
};
