import type { DefaultSession } from 'next-auth';
import type { Role } from '../types';

declare module 'next-auth' {
  interface User {
    role: Role;
  }
  interface Session {
    user: {
      role: Role;
    } & DefaultSession['user'];
  }
}

// next-auth/jwt chỉ re-export từ @auth/core/jwt nên phải mở rộng ở module gốc.
declare module '@auth/core/jwt' {
  interface JWT {
    role: Role;
  }
}
