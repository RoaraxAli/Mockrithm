import { type BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

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
      url: '/documentation/user',
    },
    {
      title: 'Developer Docs',
      description: 'API and system architecture documentation',
      url: '/documentation/dev',
    },
  ],
};
