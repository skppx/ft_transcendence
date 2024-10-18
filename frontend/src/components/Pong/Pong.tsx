import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { SocketContextProvider, useSocketContext } from '../../contexts/socket';
import { connectSocket } from '../../utils/functions/socket';
import { useDraw } from '../../utils/hooks/useDraw';
import { usePaddle } from '../../utils/hooks/usePaddle';
import { Canvas } from './Canvas';
import { usePlayerReady } from '../../utils/hooks/usePlayersJoinedParty';
import {
  PongStateContextProvider,
  usePongStateContext
} from '../../contexts/pongState';
import { WaitingButton } from './WaitingButton';
import { ModeButtons } from './ModeButton';
import { useGameStarted } from '../../utils/hooks/useStartGame';
import { useJoinParty } from '../../utils/hooks/useJoinParty';
import { useGameOver } from '../../utils/hooks/useGameOver';
import { ReadyButton } from './ReadyButton';
import { PlayAgainButton } from './PlayAgainButton';
import { useConnection } from '../../utils/hooks/useConnection';

function WrappedPong() {
  const { socket } = useSocketContext();
  const { isSpeedModeMatchEnd, isClassicMatchModeEnd } = usePongStateContext();
  const { drawClassicGame, width, height } = useDraw(
    isSpeedModeMatchEnd,
    isClassicMatchModeEnd
  );
  useGameOver();
  useJoinParty();
  useGameStarted();
  usePaddle();
  usePlayerReady();
  useConnection();

  useEffect(() => {
    connectSocket();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="flex h-screen items-center justify-center bg-default bg-cover">
      <Canvas draw={drawClassicGame} width={width} height={height} />
      <ModeButtons />
      <WaitingButton />
      <ReadyButton />
      <PlayAgainButton />
    </div>
  );
}

export default function Pong() {
  return (
    <>
      <SocketContextProvider>
        <PongStateContextProvider>
          <WrappedPong />
        </PongStateContextProvider>
      </SocketContextProvider>
      <Outlet />
    </>
  );
}
