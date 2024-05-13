'use client';

import { CirclePlusIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { createId } from '@paralleldrive/cuid2';
import Link from 'next/link';

export const CreateRoomButton = () => {
  return (
    <Link href={`/rooms/${createId()}`}>
      <Button type='button'>
        <CirclePlusIcon className='w-4 h-4 mr-2' />
        Buat room
      </Button>
    </Link>
  );
};
