import { useEffect } from 'react';
import { BluePongButton, RedPongButton } from './PongButton';
import { PongDiv } from './PongDiv';
import RenderIf from '../chat/RenderIf/RenderIf';
import { useSocketContext } from '../../contexts/socket';
import { usePongStateContext } from '../../contexts/pongState';

export function ReadyButton() {
  const { socket } = useSocketContext();
  const {
    isSpeedNotReady,
    isClassicNotReady,
    isClassicReady,
    isSpeedReady,
    CHANGE_MODE
  } = usePongStateContext();

  useEffect(() => {
    const onLeaveParty = () => {
      CHANGE_MODE();
    };
    socket.on('leaveParty', onLeaveParty);
    return () => {
      socket.off('leaveParty', onLeaveParty);
    };
  }, [socket, CHANGE_MODE]);

  return (
    <RenderIf
      some={[isSpeedReady, isClassicReady, isClassicNotReady, isSpeedNotReady]}
    >
      <PongDiv>
        <BluePongButton
          onClick={
            isSpeedReady || isClassicReady
              ? () => socket.emit('playerNotReady')
              : () => socket.emit('playerReady')
          }
        >
          {isSpeedReady || isClassicReady ? 'Not Ready' : 'Ready'}
        </BluePongButton>
        <RedPongButton
          onClick={() => {
            CHANGE_MODE();
            socket.emit('leaveParty');
          }}
        >
          Leave
        </RedPongButton>
      </PongDiv>
    </RenderIf>
  );
}
