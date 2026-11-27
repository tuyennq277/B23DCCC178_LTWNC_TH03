import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Không có quyền',
};

export default function ForbiddenPage() {
  return (
    <main>
      <h1>Bạn không có quyền truy cập trang này</h1>
      <Link href="/">Về trang chủ</Link>
    </main>
  );
}
