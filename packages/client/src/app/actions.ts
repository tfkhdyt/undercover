'use server';

import { isCuid } from '@paralleldrive/cuid2';
import { redirect } from 'next/navigation';
import invariant from 'tiny-invariant';

export async function joinRoom(formData: FormData) {
  const data = Object.fromEntries(formData);
  invariant(data.roomId);
  if (isCuid(data.roomId as string)) {
    redirect(`/rooms/${data.roomId}`);
    // return { message: 'Room ID tidak valid' };
  }
}
