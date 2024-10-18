import { Socket } from 'socket.io-client';

export async function expectEvent(
  socket: Socket,
  event: string
): Promise<void> {
  return new Promise<void>((resolve) => {
    socket.on(event, () => {
      resolve();
    });
  });
}

export default {};
