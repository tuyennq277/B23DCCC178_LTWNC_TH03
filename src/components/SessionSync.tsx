'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Sau khi đăng nhập bằng Server Action, trang được chuyển hướng phía client nên
 * SessionProvider chưa biết đã có phiên mới. Khu vực thành viên luôn có phiên
 * (proxy đã chặn), nên nếu client vẫn thấy "chưa đăng nhập" thì tải lại phiên 1 lần.
 */
export default function SessionSync() {
  const { status, update } = useSession();
  const synced = useRef(false);

  useEffect(() => {
    if (status === 'unauthenticated' && !synced.current) {
      synced.current = true;
      void update();
    }
  }, [status, update]);

  return null;
}
