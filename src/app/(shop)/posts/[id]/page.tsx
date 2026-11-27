import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/format';
import { getPublicPost, getPublicPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/site';
import { nowTime } from '@/lib/time';

// ISR: trang tĩnh, tối đa 30 giây thì sinh lại.
export const revalidate = 30;

type Params = Promise<{ id: string }>;

// SSG: chỉ sinh sẵn 10 tin công khai đầu tiên, các tin khác sinh khi có người mở.
export async function generateStaticParams(): Promise<{ id: string }[]> {
  const posts = await getPublicPosts();
  return posts.slice(0, 10).map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const post = await getPublicPost(Number(id));
  if (!post) return { title: 'Không tìm thấy tin đăng' };

  const title = `${post.title} – ${post.place}`;
  return {
    title,
    description: post.description,
    openGraph: {
      title,
      description: post.description,
    },
  };
}

export default async function PostDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const post = await getPublicPost(Number(id));
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Tin đăng', item: `${SITE_URL}/posts` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/posts/${post.id}` },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <h1>{post.title}</h1>
      <p>Loại tin: {post.kind}</p>
      <p>Danh mục: {post.category}</p>
      <p>Địa điểm: {post.place}</p>
      <p>Ngày: {formatDate(post.date)}</p>
      <p>Người đăng: {post.authorEmail}</p>
      <p style={{ whiteSpace: 'pre-line' }}>{post.description}</p>
      <p>Cập nhật lúc: {nowTime()}</p>
    </main>
  );
}
