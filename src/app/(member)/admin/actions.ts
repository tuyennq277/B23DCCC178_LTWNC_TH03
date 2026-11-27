'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { isModerationDecision, moderate } from '@/lib/moderation';
import { can } from '@/lib/permissions';

export async function moderatePost(id: number, status: string): Promise<void> {
  // Server Action là endpoint công khai → tự kiểm tra quyền.
  const session = await auth();
  if (!can(session?.user?.role, 'post:moderate')) {
    throw new Error('Không có quyền');
  }
  if (!Number.isInteger(id) || !isModerationDecision(status)) return;

  if (moderate(id, status)) {
    revalidatePath('/admin');
    revalidatePath('/posts');
    revalidatePath('/');
    revalidatePath(`/posts/${id}`);
  }
}
