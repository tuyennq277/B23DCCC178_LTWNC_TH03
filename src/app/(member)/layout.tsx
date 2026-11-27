import type { ReactNode } from 'react';
import SessionSync from '@/components/SessionSync';

export default function MemberLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SessionSync />
      <div className="member-banner">Khu vực thành viên</div>
      {children}
    </>
  );
}
