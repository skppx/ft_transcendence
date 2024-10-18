import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { SocketContextProvider, useSocketContext } from '../../contexts/socket';
import { connectSocket } from '../../utils/functions/socket';
import {
  PongInviteStateContextProvider,
  useInvitePongStateContext
} from '../../contexts/pongInviteState';
import { usePaddle } from '../../utils/hooks/usePaddle';
import { Canvas } from '../Pong/Canvas';
import {
  useInviteGameOver,
  useJoinInviteParty
} from '../../utils/hooks/useInviteGameOver';
import {
  useInviteConnection,
  useInviteGameStarted
} from '../../utils/hooks/useInviteGameStarted';
import { useInvitePlayerReady } from '../../utils/hooks/useInvitePlayerReady';
import { InviteModeButtons } from './InviteModeButtons';
import { InviteWaitingButton } from './InviteWaitingButton';
import { InviteReadyButton } from './InviteReadyButton';
import { InvitePlayAgainButton } from './InvitePlayAgainButton';
import { useDraw } from '../../utils/hooks/useDraw';

function InviteWrappedPong() {
  const { socket } = useSocketContext();
  const { isSpeedModeMatchEnd, isClassicMatchModeEnd } =
    useInvitePongStateContext();
  const { drawClassicGame, width, height } = useDraw(
    isSpeedModeMatchEnd,
    isClassicMatchModeEnd
  );
  useInviteGameOver();
  useJoinInviteParty();
  useInviteGameStarted();
  usePaddle();
  useInvitePlayerReady();
  useInviteConnection();
  const { send } = useInvitePongStateContext();

  useEffect(() => {
    const onInviteAccept = () => {
      send('CLASSIC_INIT_READY');
      send('SPEED_INIT_READY');
    };
    socket.on('inviteAccept', onInviteAccept);
    return () => {
      socket.off('inviteAccept', onInviteAccept);
    };
  }, [socket, send]);

  useEffect(() => {
    connectSocket();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="flex h-screen items-center justify-center bg-default bg-cover">
      <Canvas draw={drawClassicGame} width={width} height={height} />
      <InviteModeButtons />
      <InviteWaitingButton />
      <InviteReadyButton />
      <InvitePlayAgainButton />
    </div>
  );
}

export default function InvitePong() {
  return (
    <>
      <PongInviteStateContextProvider>
        <SocketContextProvider>
          <InviteWrappedPong />
        </SocketContextProvider>
      </PongInviteStateContextProvider>
      <Outlet />
    </>
  );
}
