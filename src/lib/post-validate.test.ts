import { describe, expect, it } from 'vitest';
import { toPostInput, today, validatePost, type PostInput } from './post-validate';

const valid: PostInput = {
  title: 'Mất tai nghe không dây',
  kind: 'Thất lạc',
  category: 'Khác',
  place: 'Thư viện',
  date: '2026-11-10',
  description: 'Tai nghe màu trắng, để quên ở bàn tầng 2.',
  contactType: 'Zalo',
  contact: '0912345678',
};

const tomorrow = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

describe('validatePost', () => {
  it('tin hợp lệ thì trả về object rỗng', () => {
    expect(validatePost(valid)).toEqual({});
  });

  it('form trống báo lỗi ở đủ các trường', () => {
    expect(validatePost(toPostInput({}))).toEqual({
      title: 'Tiêu đề tối thiểu 5 ký tự',
      kind: 'Hãy chọn loại tin',
      category: 'Hãy chọn danh mục',
      place: 'Hãy chọn địa điểm',
      date: 'Hãy chọn ngày',
      description: 'Mô tả tối thiểu 20 ký tự',
      contact: 'Số Zalo gồm 10 chữ số, bắt đầu bằng 0',
    });
  });

  it('ngày ở tương lai thì báo lỗi, ngày hôm nay thì hợp lệ', () => {
    expect(validatePost({ ...valid, date: tomorrow() }).date).toBe('Ngày không được ở tương lai');
    expect(validatePost({ ...valid, date: today() })).toEqual({});
  });

  it('tiêu đề dưới 5 ký tự sau khi trim và trên 80 ký tự đều báo lỗi', () => {
    expect(validatePost({ ...valid, title: '   abcd   ' }).title).toBe('Tiêu đề tối thiểu 5 ký tự');
    expect(validatePost({ ...valid, title: 'a'.repeat(81) }).title).toBe('Tiêu đề tối đa 80 ký tự');
    expect(validatePost({ ...valid, title: 'a'.repeat(80) }).title).toBeUndefined();
  });

  it('loại tin không tồn tại thì báo hãy chọn loại tin', () => {
    expect(validatePost({ ...valid, kind: 'Cho mượn' }).kind).toBe('Hãy chọn loại tin');
  });

  it('liên hệ Email sai định dạng thì báo lỗi, đúng định dạng thì hợp lệ', () => {
    expect(validatePost({ ...valid, contactType: 'Email', contact: 'abc' }).contact).toBe('Email không hợp lệ');
    expect(validatePost({ ...valid, contactType: 'Email', contact: 'sv01@ptit.edu.vn' })).toEqual({});
  });

  it('liên hệ SĐT thiếu số thì báo lỗi số điện thoại', () => {
    expect(validatePost({ ...valid, contactType: 'SĐT', contact: '091234567' }).contact).toBe(
      'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0',
    );
  });

  it('loại liên hệ lạ thì báo hãy chọn loại liên hệ', () => {
    expect(validatePost({ ...valid, contactType: 'Fax' }).contact).toBe('Hãy chọn loại liên hệ');
  });
});

describe('toPostInput', () => {
  it('đọc được FormData, thiếu trường thành chuỗi rỗng và loại liên hệ mặc định là Zalo', () => {
    const fd = new FormData();
    fd.set('title', 'Mất ví');
    const input = toPostInput(fd);
    expect(input.title).toBe('Mất ví');
    expect(input.kind).toBe('');
    expect(input.contactType).toBe('Zalo');
  });
});
