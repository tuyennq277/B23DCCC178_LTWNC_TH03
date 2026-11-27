'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export interface LoginState {
  error?: string;
  email?: string;
}

/** Chỉ cho phép chuyển hướng trong cùng trang web. */
const safeCallback = (value: FormDataEntryValue | null): string => {
  const url = typeof value === 'string' ? value : '';
  return url.startsWith('/') && !url.startsWith('//') ? url : '/my-posts';
};

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '');
  try {
    await signIn('credentials', {
      email,
      password: String(formData.get('password') ?? ''),
      redirectTo: safeCallback(formData.get('callbackUrl')),
    });
    return {};
  } catch (error) {
    // signIn thành công sẽ redirect bằng cách ném exception → phải ném lại.
    if (error instanceof AuthError) {
      return { error: 'Email hoặc mật khẩu không đúng', email };
    }
    throw error;
  }
}
