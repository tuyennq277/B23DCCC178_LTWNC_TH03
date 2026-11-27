import Link from 'next/link';
import { getPublicPosts } from '@/lib/posts';

// SSG: không đọc cookie/searchParams nên được sinh sẵn HTML khi build,
// làm mới bằng revalidatePath('/') khi dữ liệu thay đổi.
export default async function HomePage() {
  const posts = await getPublicPosts();

  return (
    <main>
      <h1>PTIT Found – Tìm đồ thất lạc</h1>
      <p>{posts.length} tin đang hiển thị</p>
      <Link href="/posts">Xem tất cả tin</Link>
    </main>
  );
}
