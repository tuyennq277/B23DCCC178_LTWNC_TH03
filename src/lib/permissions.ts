import type { Role } from '../types';

export type Action = 'post:view' | 'post:create' | 'post:resolve' | 'post:moderate';

const PERMISSIONS: Record<Role | 'guest', readonly Action[]> = {
  guest: ['post:view'],
  member: ['post:view', 'post:create', 'post:resolve'],
  admin: ['post:view', 'post:moderate'],
};

/** role undefined nghĩa là khách (chưa đăng nhập). */
export const can = (role: Role | undefined, action: Action): boolean =>
  PERMISSIONS[role ?? 'guest'].includes(action);
