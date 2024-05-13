'use client';

import { joinRoom } from '@/app/actions';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export const JoinRoomInput = () => {
  // const [state, formAction] = useActionState(joinRoom, { message: '' });
  //
  // useEffect(() => {
  //   if (state.message) {
  //     toast.error(state.message);
  //   }
  // }, [state]);

  return (
    <form className='flex space-x-2' action={joinRoom}>
      <Input type='text' placeholder='Masukkan kode' name='roomId' />
      <Button type='submit' variant='ghost'>
        Gabung
      </Button>
    </form>
  );
};
