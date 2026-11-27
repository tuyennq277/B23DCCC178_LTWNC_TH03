import Link from 'next/link';

export default function PostNotFound() {
  return (
    <main>
      <h1>Không tìm thấy tin đăng</h1>
      <p>Tin này không tồn tại hoặc chưa được hiển thị công khai.</p>
      <Link href="/posts">Quay lại danh sách tin</Link>
    </main>
  );
}
