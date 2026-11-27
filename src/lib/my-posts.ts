import { db } from './db';
import { isCategory, isKind, isPlace, type PostInput } from './post-validate';
import type { Post, PostStatus } from '../types';

export type StatusFilter = PostStatus | '';

export interface MyPostsPage {
  items: Post[];
  nextCursor: number | null;
  total: number;
}

export type ResolveResult = 'ok' | 'not-found' | 'forbidden' | 'not-approved';

/** Chỉ nhận pending / approved / hidden, giá trị khác coi như không lọc. */
export const parseStatus = (v: unknown): StatusFilter =>
  v === 'pending' || v === 'approved' || v === 'hidden' ? v : '';

/** Tin của chính người dùng (mọi trạng thái), lấy `size` tin bắt đầu từ `cursor`. */
export function listMine(
  email: string,
  status: StatusFilter,
  cursor = 0,
  size = 8,
): MyPostsPage {
  const mine = db.posts.filter(
    (p) => p.authorEmail === email && (status === '' || p.status === status),
  );
  const items = mine.slice(cursor, cursor + size);
  const end = cursor + items.length;
  return {
    items,
    nextCursor: end < mine.length ? end : null,
    total: mine.length,
  };
}

/** Tạo tin mới (chờ duyệt), thêm vào đầu danh sách. Input phải đã qua validatePost. */
export function submitPost(email: string, input: PostInput): Post {
  if (!isKind(input.kind) || !isCategory(input.category) || !isPlace(input.place)) {
    throw new Error('Dữ liệu tin đăng không hợp lệ');
  }
  const post: Post = {
    id: db.nextPostId++,
    title: input.title.trim(),
    kind: input.kind,
    category: input.category,
    place: input.place,
    date: input.date,
    description: `${input.description.trim()}\nLiên hệ: ${input.contactType} ${input.contact.trim()}`,
    authorEmail: email,
    status: 'pending',
    resolved: false,
  };
  db.posts.unshift(post);
  return post;
}

/** Người đăng đánh dấu tin (đang hiển thị) của mình là đã nhận lại. */
export function resolvePost(email: string, id: number): ResolveResult {
  const post = db.posts.find((p) => p.id === id);
  if (!post) return 'not-found';
  if (post.authorEmail !== email) return 'forbidden';
  if (post.status !== 'approved') return 'not-approved';
  post.resolved = true;
  return 'ok';
}
