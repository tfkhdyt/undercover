'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import invariant from 'tiny-invariant';

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const handleCopyRoomId = async () => {
    await navigator.clipboard.writeText(params.roomId);
    toast.success('Room ID telah berhasil di-salin');
  };

  const handleCopyRoomUrl = async () => {
    invariant(process.env.NEXT_PUBLIC_APP_URL);

    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_APP_URL}/rooms/${params.roomId}`,
    );
    toast.success('Room URL telah berhasil di-salin');
  };

  return (
    <main className='bg-slate-900 min-h-svh dark'>
      <div className='flex items-center space-x-2 p-4'>
        <h1 className='text-white font-medium text-2xl'>
          Room ID: {params.roomId}
        </h1>
        <Button onClick={handleCopyRoomId}>Copy Room ID</Button>
        <Button onClick={handleCopyRoomUrl}>Copy Room URL</Button>
        <Link href='/'>
          <Button variant='destructive'>Quit</Button>
        </Link>
      </div>
    </main>
  );
}
