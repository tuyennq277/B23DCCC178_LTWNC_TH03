'use client';

import { useActionState } from 'react';
import { CATEGORIES, KINDS, PLACES } from '@/data/posts';
import { CONTACT_TYPES, type PostFormState, type PostInput } from '@/lib/post-validate';

export interface PostFormProps {
  action: (prev: PostFormState, formData: FormData) => Promise<PostFormState>;
}

// version tăng sau mỗi lần gửi → dùng làm key để dựng lại form với defaultValue mới.
type VersionedState = PostFormState & { version: number };

const initialState: VersionedState = { errors: {}, values: {}, version: 0 };

export default function PostForm({ action }: PostFormProps) {
  const [state, formAction, pending] = useActionState<VersionedState, FormData>(
    async (prev, formData) => ({ ...(await action(prev, formData)), version: prev.version + 1 }),
    initialState,
  );
  const { errors, values } = state;

  const fieldProps = (name: keyof PostInput) => ({
    id: `post-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `post-${name}-error` : undefined,
  });

  const errorOf = (name: keyof PostInput) =>
    errors[name] ? (
      <p id={`post-${name}-error`} role="alert" className="error">{errors[name]}</p>
    ) : null;

  return (
    <form key={state.version} action={formAction} className="post-form" noValidate>
      <div className="field">
        <label htmlFor="post-title">Tiêu đề</label>
        <input type="text" {...fieldProps('title')} defaultValue={values.title ?? ''} />
        {errorOf('title')}
      </div>

      <div className="field">
        <label htmlFor="post-kind">Loại tin</label>
        <select {...fieldProps('kind')} defaultValue={values.kind ?? ''}>
          <option value="">-- Chọn --</option>
          {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        {errorOf('kind')}
      </div>

      <div className="field">
        <label htmlFor="post-category">Danh mục</label>
        <select {...fieldProps('category')} defaultValue={values.category ?? ''}>
          <option value="">-- Chọn --</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errorOf('category')}
      </div>

      <div className="field">
        <label htmlFor="post-place">Địa điểm</label>
        <select {...fieldProps('place')} defaultValue={values.place ?? ''}>
          <option value="">-- Chọn --</option>
          {PLACES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        {errorOf('place')}
      </div>

      <div className="field">
        <label htmlFor="post-date">Ngày</label>
        <input type="date" {...fieldProps('date')} defaultValue={values.date ?? ''} />
        {errorOf('date')}
      </div>

      <div className="field">
        <label htmlFor="post-description">Mô tả</label>
        <textarea rows={3} {...fieldProps('description')} defaultValue={values.description ?? ''} />
        {errorOf('description')}
      </div>

      <div className="field">
        <label htmlFor="post-contactType">Loại liên hệ</label>
        <select {...fieldProps('contactType')} defaultValue={values.contactType ?? 'Zalo'}>
          {CONTACT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {errorOf('contactType')}
      </div>

      <div className="field">
        <label htmlFor="post-contact">Thông tin liên hệ</label>
        <input type="text" {...fieldProps('contact')} defaultValue={values.contact ?? ''} />
        {errorOf('contact')}
      </div>

      <button type="submit" disabled={pending}>Đăng tin</button>

      {state.message && (
        <p role="status" className={state.ok ? 'success' : 'error'}>{state.message}</p>
      )}
    </form>
  );
}
