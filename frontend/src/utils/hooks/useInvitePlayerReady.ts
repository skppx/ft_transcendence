import { useEffect } from 'react';
import { useInvitePongStateContext } from '../../contexts/pongInviteState';
import { useSocketContext } from '../../contexts/socket';

export function useInvitePlayerReady() {
  const { socket } = useSocketContext();
  const { SET_READY, SET_NOTREADY } = useInvitePongStateContext();

  useEffect(() => {
    const onP1Ready = (ready: boolean) => {
      if (ready) {
        SET_READY();
      } else {
        SET_NOTREADY();
      }
    };

    socket.on('playerReady', onP1Ready);
    socket.on('isPlayerReady', onP1Ready);

    return () => {
      socket.off('playerReady', onP1Ready);
      socket.off('isPlayerReady', onP1Ready);
    };
  });
}
