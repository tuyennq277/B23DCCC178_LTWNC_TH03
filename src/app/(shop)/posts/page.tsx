import type { Metadata } from 'next';
import Link from 'next/link';
import { KINDS } from '@/data/posts';
import { formatDate } from '@/lib/format';
import { getPublicPosts } from '@/lib/posts';
import { nowTime } from '@/lib/time';

export const metadata: Metadata = {
  title: 'Tin đăng',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (v: string | string[] | undefined): string =>
  (Array.isArray(v) ? v[0] : v) ?? '';

// SSR: đọc searchParams nên render lại mỗi request.
export default async function PostsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = first(sp.q);
  const kind = first(sp.kind);
  const sort = first(sp.sort);

  const posts = await getPublicPosts({ q, kind, sort });

  return (
    <main>
      <h1>Tin đang hiển thị</h1>

      <form method="GET" action="/posts" className="filters">
        <div>
          <label htmlFor="q">Tìm kiếm</label>
          <input id="q" name="q" type="search" defaultValue={q} />
        </div>
        <div>
          <label htmlFor="kind">Loại tin</label>
          <select id="kind" name="kind" defaultValue={kind}>
            <option value="">Tất cả</option>
            {KINDS.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort">Sắp xếp</label>
          <select id="sort" name="sort" defaultValue={sort}>
            <option value="">Mặc định</option>
            <option value="date-desc">Mới nhất</option>
            <option value="date-asc">Cũ nhất</option>
          </select>
        </div>
        <button type="submit">Lọc</button>
      </form>

      <p>Có {posts.length} tin đang hiển thị</p>
      <p>Render lúc: {nowTime()}</p>

      {posts.length === 0 ? (
        <p>Không có tin nào phù hợp</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Loại tin</th>
              <th>Địa điểm</th>
              <th>Ngày</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td><Link href={`/posts/${p.id}`}>{p.title}</Link></td>
                <td>{p.kind}</td>
                <td>{p.place}</td>
                <td>{formatDate(p.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
