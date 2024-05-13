'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import invariant from 'tiny-invariant';
import { Socket, io } from 'socket.io-client';
import Peer, { MediaConnection } from 'peerjs';
import { cn } from '@/lib/utils';
import { P, match } from 'ts-pattern';

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const socket = useRef<Socket | null>(null);
  const myPeer = useRef<Peer>(
    new Peer({
      host: 'localhost',
      port: 8081,
    }),
  );
  const videoGrid = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);
  const [numberOfUsers, setNumberOfUsers] = useState(1);
  const [peers, setPeers] = useState<Record<string, MediaConnection>>({});

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const myVideo = document.createElement('video');
      myVideo.classList.add('rounded-xl');
      myVideo.muted = true;

      navigator.mediaDevices
        .getUserMedia({
          video: {
            height: {
              ideal: 720,
            },
            width: {
              ideal: 1280,
            },
          },
          audio: true,
        })
        .then((stream) => {
          addVideoStream(myVideo, stream);

          myPeer.current.on('call', (call) => {
            call.answer(stream);
            const video = document.createElement('video');
            video.classList.add('rounded-xl');
            call.on('stream', (userVideoStream) => {
              addVideoStream(video, userVideoStream);
            });
          });

          invariant(socket.current);
          socket.current.on('user-connected', (userId) => {
            connectToNewUser(userId, stream);
          });
        });

      socket.current = io('http://localhost:8080');

      socket.current.on('user-disconnected', (userId) => {
        if (peers[userId]) peers[userId].close();
      });

      invariant(socket.current);
      myPeer.current.on('open', (userId) => {
        invariant(socket.current);
        socket.current.emit('join-room', params.roomId, userId);
      });
    }
  }, []);

  const connectToNewUser = (userId: string, stream: MediaStream) => {
    const call = myPeer.current.call(userId, stream);
    const video = document.createElement('video');

    call.on('stream', (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });

    call.on('close', () => {
      video.remove();
    });

    setPeers((peer) => {
      peer[userId] = call;
      return peer;
    });
  };

  const addVideoStream = (video: HTMLVideoElement, stream: MediaStream) => {
    video.srcObject = stream;
    video.classList.add('rounded-xl');
    video.addEventListener('loadedmetadata', () => video.play());

    invariant(videoGrid.current);
    videoGrid.current.append(video);
    setNumberOfUsers((state) => state++);
  };

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
        <Link
          href='/'
          onClick={() => {
            invariant(socket.current);
            socket.current.close();
          }}
        >
          <Button variant='destructive'>Quit</Button>
        </Link>
      </div>
      <div
        ref={videoGrid}
        className={cn(
          `grid gap-2 place-items-center p-4`,
          match(Object.keys(peers).length + 1)
            .with(1, () => 'grid-cols-1')
            .with(2, () => 'lg:grid-cols-2')
            .with(P.union(3, 4), () => 'grid-cols-2')
            .with(P.union(5, 6), () => 'lg:grid-cols-3')
            .otherwise(() => 'grid-cols-2 lg:grid-cols-4'),
        )}
      ></div>
    </main>
  );
}
