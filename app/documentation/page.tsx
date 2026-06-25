import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  if (host.includes('docs.mockrithm.me')) {
    redirect('/user');
  }

  redirect('/documentation/user');
}
