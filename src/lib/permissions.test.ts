import { describe, expect, it } from 'vitest';
import { can } from './permissions';

describe('can – ma trận quyền', () => {
  it('khách chỉ được xem tin, không đăng, không đánh dấu, không kiểm duyệt', () => {
    expect(can(undefined, 'post:view')).toBe(true);
    expect(can(undefined, 'post:create')).toBe(false);
    expect(can(undefined, 'post:resolve')).toBe(false);
    expect(can(undefined, 'post:moderate')).toBe(false);
  });

  it('thành viên đăng tin và đánh dấu đã nhận lại được nhưng không kiểm duyệt được', () => {
    expect(can('member', 'post:view')).toBe(true);
    expect(can('member', 'post:create')).toBe(true);
    expect(can('member', 'post:resolve')).toBe(true);
    expect(can('member', 'post:moderate')).toBe(false);
  });

  it('quản trị viên kiểm duyệt được nhưng không đăng tin được', () => {
    expect(can('admin', 'post:moderate')).toBe(true);
    expect(can('admin', 'post:view')).toBe(true);
    expect(can('admin', 'post:create')).toBe(false);
    expect(can('admin', 'post:resolve')).toBe(false);
  });
});
