import { useEffect } from 'react';
import { useInvitePongStateContext } from '../../contexts/pongInviteState';
import { useSocketContext } from '../../contexts/socket';
import { BluePongButton, RedPongButton } from '../Pong/PongButton';
import { PongDiv } from '../Pong/PongDiv';
import RenderIf from '../chat/RenderIf/RenderIf';

export function InviteReadyButton() {
  const { socket } = useSocketContext();
  const {
    isSpeedNotReady,
    isClassicNotReady,
    isClassicReady,
    isSpeedReady,
    CHANGE_MODE
  } = useInvitePongStateContext();

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
