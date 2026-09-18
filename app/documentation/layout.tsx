import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import { docsOptions } from '@/app/layout.config';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{ enabled: false }}
      theme={{
        attribute: 'class',
        defaultTheme: 'dark',
        enableSystem: false,
        storageKey: 'docs-theme',
      }}
    >
      <DocsLayout tree={source.pageTree} {...docsOptions}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}

