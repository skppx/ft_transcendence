import { useEffect } from 'react';
import { useInvitePongStateContext } from '../../contexts/pongInviteState';
import { useSocketContext } from '../../contexts/socket';

export function useInviteGameOver() {
  const { socket } = useSocketContext();
  const { END_MATCH } = useInvitePongStateContext();

  useEffect(() => {
    socket.on('gameOver', END_MATCH);

    return () => {
      socket.off('gameOver', END_MATCH);
    };
  }, [socket, END_MATCH]);
}

export function useJoinInviteParty() {
  const { socket } = useSocketContext();
  const { JOIN_PARTY_LOBBY } = useInvitePongStateContext();

  useEffect(() => {
    socket.on('joinParty', JOIN_PARTY_LOBBY);
    return () => {
      socket.off('joinParty', JOIN_PARTY_LOBBY);
    };
  }, [socket, JOIN_PARTY_LOBBY]);
}
