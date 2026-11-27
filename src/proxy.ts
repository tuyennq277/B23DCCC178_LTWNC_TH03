import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export default auth((req) => {
  const { pathname, search } = req.nextUrl;

  // Chưa đăng nhập → về trang đăng nhập, nhớ đường dẫn đang vào.
  if (!req.auth) {
    const url = new URL('/login', req.nextUrl.origin);
    url.searchParams.set('callbackUrl', pathname + search);
    return NextResponse.redirect(url);
  }

  // Vào khu quản trị mà không phải admin → trang báo không có quyền.
  if (pathname.startsWith('/admin') && req.auth.user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/forbidden', req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/my-posts/:path*', '/admin/:path*'],
};
