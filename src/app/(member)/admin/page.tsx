import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { formatDate } from '@/lib/format';
import { getStats, listPending } from '@/lib/moderation';
import { can } from '@/lib/permissions';
import { moderatePost } from './actions';

export const metadata: Metadata = {
  title: 'Kiểm duyệt tin đăng',
  robots: { index: false },
};

export default async function AdminPage() {
  // Lớp bảo vệ thứ 2 (phòng khi proxy cấu hình sai).
  const session = await auth();
  if (!can(session?.user?.role, 'post:moderate')) redirect('/forbidden');

  const stats = getStats();
  const pending = listPending();

  return (
    <main>
      <h1>Kiểm duyệt tin đăng</h1>
      <p>
        Chờ duyệt: {stats.pending} | Đang hiển thị: {stats.visible} | Đã ẩn: {stats.hidden}
      </p>

      {pending.length === 0 ? (
        <p>Không có tin nào chờ duyệt</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Ngày</th>
              <th>Người đăng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{formatDate(p.date)}</td>
                <td>{p.authorEmail}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <form action={moderatePost.bind(null, p.id, 'approved')}>
                    <button type="submit">Duyệt</button>
                  </form>
                  <form action={moderatePost.bind(null, p.id, 'hidden')}>
                    <button type="submit">Ẩn</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
