import { db } from './db';
import type { Post, PostStatus } from '../types';

export type ModerationDecision = Extract<PostStatus, 'approved' | 'hidden'>;

export const isModerationDecision = (v: unknown): v is ModerationDecision =>
  v === 'approved' || v === 'hidden';

export interface PostStats {
  pending: number;
  visible: number;
  hidden: number;
}

export const getStats = (): PostStats => ({
  pending: db.posts.filter((p) => p.status === 'pending').length,
  visible: db.posts.filter((p) => p.status === 'approved' && !p.resolved).length,
  hidden: db.posts.filter((p) => p.status === 'hidden').length,
});

export const listPending = (): Post[] => db.posts.filter((p) => p.status === 'pending');

/** Duyệt hoặc ẩn 1 tin; chỉ đổi được tin đang chờ duyệt. Trả true nếu đã đổi. */
export const moderate = (id: number, decision: ModerationDecision): boolean => {
  const post = db.posts.find((p) => p.id === id);
  if (!post || post.status !== 'pending') return false;
  post.status = decision;
  return true;
};
