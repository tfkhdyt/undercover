'use client';

import { CirclePlusIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { createId } from '@paralleldrive/cuid2';
import { useRouter } from 'next/navigation';

export const CreateRoomButton = () => {
  const router = useRouter();

  const handleCreateRoom = () => {
    const roomId = createId();

    router.push(`/rooms/${roomId}`);
  };

  return (
    <Button type='button' onClick={handleCreateRoom}>
      <CirclePlusIcon className='w-4 h-4 mr-2' />
      Buat room
    </Button>
  );
};
