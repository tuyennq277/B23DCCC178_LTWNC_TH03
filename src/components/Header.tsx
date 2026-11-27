'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <header className="site-header">
      <Link href="/" className="brand">PTIT Found</Link>
      <nav>
        <Link href="/">Trang chủ</Link>
        <Link href="/posts">Tin đăng</Link>
        {user && <Link href="/my-posts">Tin của tôi</Link>}
        {user?.role === 'admin' && <Link href="/admin">Quản trị</Link>}
      </nav>
      <span className="spacer" />
      {status === 'loading' ? null : user ? (
        <>
          <span>Xin chào, {user.name} ({user.role})</span>
          <button type="button" onClick={() => signOut({ redirectTo: '/' })}>
            Đăng xuất
          </button>
        </>
      ) : (
        <Link href="/login">Đăng nhập</Link>
      )}
    </header>
  );
}
