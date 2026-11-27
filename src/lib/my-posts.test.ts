import { beforeEach, describe, expect, it } from 'vitest';
import { generatePosts } from '../data/posts';
import { db } from './db';
import { listMine, parseStatus, resolvePost, submitPost } from './my-posts';
import type { PostInput } from './post-validate';

const SV01 = 'sv01@ptit.edu.vn';
const SV02 = 'sv02@ptit.edu.vn';

const input: PostInput = {
  title: 'Mất tai nghe không dây',
  kind: 'Thất lạc',
  category: 'Khác',
  place: 'Thư viện',
  date: '2026-11-10',
  description: 'Tai nghe màu trắng, để quên ở bàn tầng 2.',
  contactType: 'Zalo',
  contact: '0912345678',
};

beforeEach(() => {
  // Đưa dữ liệu về ban đầu, sửa trực tiếp mảng db.posts.
  db.posts.splice(0, db.posts.length, ...generatePosts(36));
  db.nextPostId = 37;
});

describe('listMine', () => {
  it('sv01 có 27 tin, lần đầu lấy 8 tin và nextCursor là 8', () => {
    const page = listMine(SV01, '');
    expect(page.total).toBe(27);
    expect(page.items).toHaveLength(8);
    expect(page.nextCursor).toBe(8);
    expect(page.items.every((p) => p.authorEmail === SV01)).toBe(true);
  });

  it('trang cuối (cursor 24) còn 3 tin và nextCursor là null', () => {
    const page = listMine(SV01, '', 24);
    expect(page.items).toHaveLength(3);
    expect(page.nextCursor).toBeNull();
  });

  it('lọc trạng thái chờ duyệt thì sv01 còn 3 tin', () => {
    const page = listMine(SV01, 'pending');
    expect(page.total).toBe(3);
    expect(page.items.every((p) => p.status === 'pending')).toBe(true);
  });

  it('sv02 chỉ có 9 tin của chính mình', () => {
    const page = listMine(SV02, '', 0, 100);
    expect(page.total).toBe(9);
    expect(page.items.every((p) => p.authorEmail === SV02)).toBe(true);
  });

  it('parseStatus chỉ nhận pending, approved, hidden', () => {
    expect(parseStatus('pending')).toBe('pending');
    expect(parseStatus('approved')).toBe('approved');
    expect(parseStatus('hidden')).toBe('hidden');
    expect(parseStatus('abc')).toBe('');
    expect(parseStatus(undefined)).toBe('');
  });
});

describe('submitPost', () => {
  it('tạo tin chờ duyệt, ghép liên hệ vào mô tả và nằm đầu mảng', () => {
    const post = submitPost(SV01, input);
    expect(post.id).toBe(37);
    expect(post.status).toBe('pending');
    expect(post.resolved).toBe(false);
    expect(post.authorEmail).toBe(SV01);
    expect(post.description.endsWith('\nLiên hệ: Zalo 0912345678')).toBe(true);
    expect(db.posts[0]).toBe(post);
    expect(db.nextPostId).toBe(38);
    expect(listMine(SV01, '').total).toBe(28);
  });
});

describe('resolvePost', () => {
  it('trả forbidden khi đánh dấu tin của người khác', () => {
    expect(resolvePost(SV02, 2)).toBe('forbidden');
  });

  it('trả not-found khi tin không tồn tại', () => {
    expect(resolvePost(SV01, 999)).toBe('not-found');
  });

  it('trả not-approved khi tin chưa được hiển thị (tin 6 đã ẩn)', () => {
    expect(resolvePost(SV01, 6)).toBe('not-approved');
  });

  it('trả ok và đánh dấu đã nhận lại khi là tin đang hiển thị của mình', () => {
    expect(resolvePost(SV01, 2)).toBe('ok');
    expect(db.posts.find((p) => p.id === 2)?.resolved).toBe(true);
  });
});
