import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInvitePongStateContext } from '../../contexts/pongInviteState';
import { useSocketContext } from '../../contexts/socket';
import { BluePongButton } from '../Pong/PongButton';
import { PongDiv } from '../Pong/PongDiv';
import RenderIf from '../chat/RenderIf/RenderIf';
import { Error } from '../Pong/Error';

export function InvitePlayAgainButton() {
  const {
    isClassicMatchModeEnd,
    isSpeedModeMatchEnd,
    send,
    PLAY_AGAIN,
    CHANGE_MODE
  } = useInvitePongStateContext();
  const { username } = useParams();
  const [errorMsg, setErrorMsg] = useState('');
  const [isErr, setIsErr] = useState(false);

  const { socket } = useSocketContext();

  const playAgain = () => {
    if (isSpeedModeMatchEnd) {
      socket.emit('createSpeedInvite', username);
    } else if (isClassicMatchModeEnd) {
      socket.emit('createClassicInvite', username);
    }
  };

  useEffect(() => {
    const onInviteAccept = () => {
      PLAY_AGAIN();
    };
    socket.on('inviteAccept', onInviteAccept);
    return () => {
      socket.off('inviteAccept', onInviteAccept);
    };
  }, [socket, PLAY_AGAIN]);

  useEffect(() => {
    const onInviteDenied = () => {
      if (isErr === false) {
        setTimeout(() => {
          setErrorMsg('');
          setIsErr(false);
        }, 3000);
      }
      setIsErr(true);
      setErrorMsg('Your invitation has been denied');
    };

    const onPlayerInvited = (mode: 'CLASSIC_MODE' | 'SPEED_MODE') => {
      send(mode);
    };

    const onPlayerAlreadyPlaying = () => {
      if (isErr === false) {
        setTimeout(() => {
          setErrorMsg('');
          setIsErr(false);
        }, 3000);
      }
      setIsErr(true);
      setErrorMsg(`${username} already in game`);
    };
    const onPlayerAlreadyInvited = () => {
      if (isErr === false) {
        setTimeout(() => {
          setErrorMsg('');
          setIsErr(false);
        }, 3000);
      }
      setIsErr(true);
      setErrorMsg(`${username} already invited by someone else`);
    };
    socket.on('inviteDenied', onInviteDenied);
    socket.on('playerInvited', onPlayerInvited);
    socket.on('playerAlreadyPlaying', onPlayerAlreadyPlaying);
    socket.on('playerAlreadyInvited', onPlayerAlreadyInvited);
    return () => {
      socket.off('inviteDenied', onInviteDenied);
      socket.off('playerInvited', onPlayerInvited);
      socket.off('playerAlreadyPlaying', onPlayerAlreadyPlaying);
      socket.off('playerAlreadyInvited', onPlayerAlreadyInvited);
    };
  }, [socket, isErr, username, CHANGE_MODE, send]);

  return (
    <RenderIf some={[isSpeedModeMatchEnd, isClassicMatchModeEnd]}>
      <PongDiv className="mt-56">
        <BluePongButton onClick={playAgain}>Play again !</BluePongButton>
        <BluePongButton onClick={CHANGE_MODE}>Change Mode ?</BluePongButton>
        <Error errorMsg={errorMsg} isErr={isErr} />
      </PongDiv>
    </RenderIf>
  );
}
