import { db } from './db';
import type { Post } from '../types';

export type SortOrder = 'date-desc' | 'date-asc';

export interface PostFilter {
  q?: string;
  kind?: string;
  sort?: string;
}

/** Tin công khai: đã được duyệt và chưa nhận lại. */
export const isPublicPost = (post: Post): boolean =>
  post.status === 'approved' && !post.resolved;

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Danh sách tin công khai, có tìm theo tiêu đề, lọc loại tin và sắp xếp theo ngày. */
export async function getPublicPosts(filter: PostFilter = {}): Promise<Post[]> {
  await delay(600); // giả lập truy vấn chậm

  const q = filter.q?.trim().toLowerCase() ?? '';
  let result = db.posts.filter(isPublicPost);

  if (q) result = result.filter((p) => p.title.toLowerCase().includes(q));
  if (filter.kind) result = result.filter((p) => p.kind === filter.kind);

  if (filter.sort === 'date-desc') {
    result = [...result].sort((a, b) => b.date.localeCompare(a.date));
  } else if (filter.sort === 'date-asc') {
    result = [...result].sort((a, b) => a.date.localeCompare(b.date));
  }
  return result;
}

/** Lấy 1 tin công khai theo id; không có hoặc chưa công khai thì trả undefined. */
export async function getPublicPost(id: number): Promise<Post | undefined> {
  const post = db.posts.find((p) => p.id === id);
  return post && isPublicPost(post) ? post : undefined;
}
