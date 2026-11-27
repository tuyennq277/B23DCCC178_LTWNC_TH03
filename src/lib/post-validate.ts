import { CATEGORIES, KINDS, PLACES } from '../data/posts';
import type { Category, Kind, Place } from '../types';

export interface PostInput {
  title: string; kind: string; category: string; place: string;
  date: string; description: string;
  contactType: string; contact: string;
}
export type PostErrors = Partial<Record<keyof PostInput, string>>;
export interface PostFormState {
  errors: PostErrors;          // lỗi từng ô
  values: Partial<PostInput>;  // giá trị đã nhập, để hiện lại khi có lỗi
  message?: string;            // thông báo chung (thành công hoặc lỗi từ server)
  ok?: boolean;                // true nếu message là thông báo thành công
}

export const CONTACT_TYPES = ['Zalo', 'SĐT', 'Email'] as const;

export const isKind = (v: string): v is Kind => (KINDS as string[]).includes(v);
export const isCategory = (v: string): v is Category => (CATEGORIES as string[]).includes(v);
export const isPlace = (v: string): v is Place => (PLACES as string[]).includes(v);

/** Ngày hôm nay (theo giờ máy) dạng YYYY-MM-DD. */
export const today = (): string => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

type RawInput = FormData | Record<string, unknown>;

const readField = (raw: RawInput, key: keyof PostInput): string | undefined => {
  const value = raw instanceof FormData ? raw.get(key) : raw[key];
  return typeof value === 'string' ? value : undefined;
};

/** Đổi FormData/object thành PostInput: thiếu trường → chuỗi rỗng, riêng contactType → 'Zalo'. */
export const toPostInput = (raw: RawInput): PostInput => ({
  title: readField(raw, 'title') ?? '',
  kind: readField(raw, 'kind') ?? '',
  category: readField(raw, 'category') ?? '',
  place: readField(raw, 'place') ?? '',
  date: readField(raw, 'date') ?? '',
  description: readField(raw, 'description') ?? '',
  contactType: readField(raw, 'contactType') ?? 'Zalo',
  contact: readField(raw, 'contact') ?? '',
});

const PHONE_RE = /^0\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const isValidDate = (v: string): boolean => {
  if (!DATE_RE.test(v)) return false;
  const [y, m, d] = v.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
};

const validateContact = (type: string, contact: string): string | undefined => {
  switch (type) {
    case 'Zalo':
      return PHONE_RE.test(contact) ? undefined : 'Số Zalo gồm 10 chữ số, bắt đầu bằng 0';
    case 'SĐT':
      return PHONE_RE.test(contact) ? undefined : 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0';
    case 'Email':
      return EMAIL_RE.test(contact) ? undefined : 'Email không hợp lệ';
    default:
      return 'Hãy chọn loại liên hệ';
  }
};

/** Nơi duy nhất giữ quy tắc kiểm tra tin đăng. Object rỗng nghĩa là hợp lệ. */
export const validatePost = (input: PostInput): PostErrors => {
  const errors: PostErrors = {};

  const title = input.title.trim();
  if (title.length < 5) errors.title = 'Tiêu đề tối thiểu 5 ký tự';
  else if (title.length > 80) errors.title = 'Tiêu đề tối đa 80 ký tự';

  if (!isKind(input.kind)) errors.kind = 'Hãy chọn loại tin';
  if (!isCategory(input.category)) errors.category = 'Hãy chọn danh mục';
  if (!isPlace(input.place)) errors.place = 'Hãy chọn địa điểm';

  if (!isValidDate(input.date)) errors.date = 'Hãy chọn ngày';
  else if (input.date.localeCompare(today()) > 0) errors.date = 'Ngày không được ở tương lai';

  if (input.description.trim().length < 20) errors.description = 'Mô tả tối thiểu 20 ký tự';

  const contactError = validateContact(input.contactType, input.contact.trim());
  if (contactError) errors.contact = contactError;

  return errors;
};
