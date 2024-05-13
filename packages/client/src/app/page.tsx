import { CreateRoomButton } from '@/components/buttons/CreateRoomButton';
import { JoinRoomInput } from '@/components/inputs/JoinRoomInput';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Undercover',
};

export default function Home() {
  return (
    <main className='flex flex-col justify-center min-h-svh container'>
      <section className='flex'>
        <div className='space-y-8'>
          <h1 className='text-4xl font-medium max-w-md leading-tight'>
            Main game undercover bersama teman
          </h1>
          <p className='text-lg text-slate-600 max-w-md'>
            Undercover merupakan online multiplayer social game yang bertujuan
            untuk mencari seorang <i>undercover</i> di dalam permainan.
          </p>
          <div className='flex space-x-4'>
            <CreateRoomButton />
            <JoinRoomInput />
          </div>
        </div>
      </section>
    </main>
  );
}
