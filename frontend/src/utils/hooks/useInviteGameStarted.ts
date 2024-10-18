import { useEffect } from 'react';
import { useInvitePongStateContext } from '../../contexts/pongInviteState';
import { useSocketContext } from '../../contexts/socket';

export function useInviteGameStarted() {
  const { socket } = useSocketContext();
  const { START_MATCH } = useInvitePongStateContext();

  useEffect(() => {
    socket.on('startGame', START_MATCH);

    return () => {
      socket.off('startGame', START_MATCH);
    };
  }, [socket, START_MATCH]);
}

export type Status =
  | 'CLASSIC_INIT_READY'
  | 'CLASSIC_INIT_END'
  | 'CLASSIC_INIT_MATCH'
  | 'CLASSIC_MODE'
  | 'default'
  | 'SPEED_INIT_READY'
  | 'SPEED_INIT_END'
  | 'SPEED_INIT_MATCH'
  | 'SPEED_MODE';

export function useInviteConnection() {
  const { socket } = useSocketContext();
  const { send } = useInvitePongStateContext();

  useEffect(() => {
    const onConnection = (status: Status) => {
      // console.log('status', status);
      send(status);
    };

    socket.on('connection', onConnection);
    return () => {
      socket.off('connection', onConnection);
    };
  });
}
