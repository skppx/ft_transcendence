import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ChatHeader from '../../components/chat/ChatHeader/ChatHeader';
import MenuSelector from '../../components/chat/MenuSelector/MenuSelector';
import { SocketContextProvider, useSocketContext } from '../../contexts/socket';
import { useSession } from '../../utils/hooks/useSession';
import { PrivateMessage } from '../../components/chat/PrivateMessage/PrivateMessage';
import { Channel } from '../../components/chat/Channel/Channel';
import { StateContextProvider } from '../../contexts/state';
import { Search } from '../../components/chat/Search';
import { Notification } from '../../components/chat/Notification';
import { PrimaryButton } from '../../components/PrimaryButton/PrimaryButton';
import RenderIf from '../../components/chat/RenderIf/RenderIf';
import { PongInviteStateContextProvider } from '../../contexts/pongInviteState';
import { Navbar } from '../../components/Navbar/Navbar';

interface InviteInterface {
  username: string;
  mode: 'classic' | 'speed';
}

interface InviteProps {
  invite: InviteInterface;
  setInvite: () => void;
}

function Invite({ invite, setInvite }: InviteProps) {
  const { socket } = useSocketContext();
  const navigate = useNavigate();

  const handleAccept = () => {
    navigate(`/pong/${invite.username}`);
    if (invite.mode === 'classic') {
      socket.emit('acceptClassicInvite');
    } else if (invite.mode === 'speed') {
      socket.emit('acceptSpeedInvite');
    }
    setInvite();
  };

  const handleDeny = () => {
    if (invite.mode === 'classic') {
      socket.emit('denyClassicInvite');
    } else if (invite.mode === 'speed') {
      socket.emit('denySpeedInvite');
    }
    setInvite();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center ">
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-pong-white bg-pong-blue-400 p-4 shadow-lg ">
        <p className="p-2 text-xl font-bold text-pong-white">{`You've been invited by ${invite.username} to play ${invite.mode} mode.`}</p>
        <div className="flex flex-row items-start gap-7">
          <PrimaryButton
            className="bg-red-700 hover:bg-red-800"
            onClick={handleDeny}
          >
            Deny
          </PrimaryButton>
          <PrimaryButton
            className="bg-green-600 hover:bg-green-700"
            onClick={handleAccept}
          >
            Accept
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function ChatWrapped() {
  const { socket } = useSocketContext();

  const [invite, setInvite] = useState<InviteInterface | undefined>(undefined);

  useEffect(() => {
    const onInvite = (i: InviteInterface) => {
      setInvite(i);
    };
    socket.on('invite', onInvite);
    return () => {
      socket.off('invite', onInvite);
    };
  }, [socket]);
  useSession((data) => {
    socket.userID = data.userID;
  });

  useEffect(() => {
    socket.emit('session');
  }, [socket]);

  return (
    <div className="absolute bottom-2 right-2 z-30 overflow-hidden rounded-3xl bg-pong-blue-300">
      <ChatHeader />
      <PrivateMessage />
      <Channel />
      <Search />
      <Notification />
      <MenuSelector />
      <RenderIf some={[invite !== undefined]}>
        <Invite invite={invite!} setInvite={() => setInvite(undefined)} />
      </RenderIf>
    </div>
  );
}

function Chat() {
  return (
    <>
      <Navbar />
      <SocketContextProvider>
        <PongInviteStateContextProvider>
          <StateContextProvider>
            <ChatWrapped />
          </StateContextProvider>
        </PongInviteStateContextProvider>
      </SocketContextProvider>
    </>
  );
}

export default Chat;
