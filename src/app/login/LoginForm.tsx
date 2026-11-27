'use client';

import { useActionState } from 'react';
import { loginAction, type LoginState } from './actions';

const initialState: LoginState = {};

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="post-form">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" defaultValue={state.email} required />
      </div>
      <div className="field">
        <label htmlFor="password">Mật khẩu</label>
        <input id="password" name="password" type="password" required />
      </div>
      {state.error && <p role="alert" className="error">{state.error}</p>}
      <button type="submit" disabled={pending}>Đăng nhập</button>
    </form>
  );
}
