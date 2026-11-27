import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Đăng nhập',
};

type SearchParams = Promise<{ callbackUrl?: string | string[] }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await auth();
  if (session?.user) redirect('/');

  const { callbackUrl } = await searchParams;
  const target = (Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl) ?? '/my-posts';

  return (
    <main>
      <h1>Đăng nhập</h1>
      <LoginForm callbackUrl={target} />
    </main>
  );
}
