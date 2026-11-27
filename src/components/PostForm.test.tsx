import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { PostFormState } from '@/lib/post-validate';
import PostForm from './PostForm';

type ActionFn = (prev: PostFormState, formData: FormData) => Promise<PostFormState>;

const mockAction = (result: PostFormState) => vi.fn<ActionFn>().mockResolvedValue(result);

describe('PostForm', () => {
  it('action trả về lỗi thì lỗi hiện ngay dưới đúng ô', async () => {
    const user = userEvent.setup();
    const action = mockAction({
      errors: { title: 'Tiêu đề tối thiểu 5 ký tự', contact: 'Số Zalo gồm 10 chữ số, bắt đầu bằng 0' },
      values: {},
    });
    render(<PostForm action={action} />);

    await user.click(screen.getByRole('button', { name: 'Đăng tin' }));

    expect(await screen.findByLabelText('Tiêu đề')).toHaveAccessibleDescription('Tiêu đề tối thiểu 5 ký tự');
    expect(screen.getByLabelText('Thông tin liên hệ')).toHaveAccessibleDescription(
      'Số Zalo gồm 10 chữ số, bắt đầu bằng 0',
    );
    expect(screen.getAllByRole('alert')).toHaveLength(2);
  });

  it('điền hợp lệ rồi gửi thì action được gọi 1 lần với đúng FormData', async () => {
    const user = userEvent.setup();
    const action = mockAction({ errors: {}, values: {}, message: 'Đã gửi tin, chờ kiểm duyệt', ok: true });
    render(<PostForm action={action} />);

    await user.type(screen.getByLabelText('Tiêu đề'), 'Nhặt được ví da');
    await user.selectOptions(screen.getByLabelText('Loại tin'), 'Nhặt được');
    await user.selectOptions(screen.getByLabelText('Danh mục'), 'Ví – giấy tờ');
    await user.selectOptions(screen.getByLabelText('Địa điểm'), 'Tòa A2');
    await user.type(screen.getByLabelText('Ngày'), '2020-01-01');
    await user.type(screen.getByLabelText('Mô tả'), 'Ví màu nâu, nhặt được ở sảnh tầng 1.');
    await user.selectOptions(screen.getByLabelText('Loại liên hệ'), 'Email');
    await user.type(screen.getByLabelText('Thông tin liên hệ'), 'sv01@ptit.edu.vn');
    await user.click(screen.getByRole('button', { name: 'Đăng tin' }));

    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
    const formData = action.mock.calls[0][1];
    expect(formData.get('kind')).toBe('Nhặt được');
    expect(formData.get('contactType')).toBe('Email');
    expect(formData.get('contact')).toBe('sv01@ptit.edu.vn');
    expect(formData.get('date')).toBe('2020-01-01');
    expect(await screen.findByText('Đã gửi tin, chờ kiểm duyệt')).toBeInTheDocument();
  });

  it('action trả "Không có quyền" thì thông báo hiện ra và tiêu đề đã nhập vẫn còn', async () => {
    const user = userEvent.setup();
    const action = mockAction({
      errors: {},
      values: { title: 'Mất chìa khóa xe máy', contactType: 'Email' },
      message: 'Không có quyền',
    });
    render(<PostForm action={action} />);

    await user.type(screen.getByLabelText('Tiêu đề'), 'Mất chìa khóa xe máy');
    await user.click(screen.getByRole('button', { name: 'Đăng tin' }));

    expect(await screen.findByText('Không có quyền')).toBeInTheDocument();
    expect(screen.getByLabelText('Tiêu đề')).toHaveValue('Mất chìa khóa xe máy');
    expect(screen.getByLabelText('Loại liên hệ')).toHaveValue('Email');
  });

  it('mặc định Loại liên hệ là Zalo', () => {
    render(<PostForm action={mockAction({ errors: {}, values: {} })} />);
    expect(screen.getByLabelText('Loại liên hệ')).toHaveValue('Zalo');
    expect(screen.getByRole('button', { name: 'Đăng tin' })).toBeEnabled();
  });
});
