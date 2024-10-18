import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Scrollable } from './Scrollable/Scrollable';
import { useInviteList } from '../../utils/hooks/useInviteList';
import { useSocketContext } from '../../contexts/socket';
import ProfilePicture from './ProfilePicture/ProfilePicture';
import { Contact } from '../../utils/hooks/useStatus.interfaces';
import SecondaryButton from '../SecondaryButton/SecondaryButton';
import { PrimaryButton } from '../PrimaryButton/PrimaryButton';
import { useStateContext } from '../../contexts/state';

interface InviteContactProps {
  username: string;
  invite: () => any;
  userID: string;
}

export function InviteContact({
  username,
  invite,
  userID
}: InviteContactProps) {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="mx-2 my-1 flex
         flex-shrink-0 items-center justify-between p-3 text-left"
        role="presentation"
      >
        <div className="flex items-center justify-center gap-3">
          <ProfilePicture
            size="xs"
            userID={userID}
            onClick={() => navigate(`/profile/${username}`)}
            username={username}
          />
          <p className="semibold max-w-[200px] break-all text-base text-pong-white">
            {username}
          </p>
        </div>
        <SecondaryButton span="invite" onClick={invite} />
      </div>
      <hr className="border-pong-blue-700" />
    </>
  );
}

interface InviteChannelViewProps {
  chanID: string;
}

export function InviteChannelView({ chanID }: InviteChannelViewProps) {
  const { socket } = useSocketContext();
  const { toggleChannelView } = useStateContext();
  const inviteList = useInviteList();

  useEffect(() => {
    if (chanID.length) {
      socket.emit('invitableMembers', {
        chanID
      });
    }
  }, [socket, chanID]);

  return (
    <>
      <Scrollable width={336}>
        {inviteList.length ? (
          <>
            {inviteList.map((user: Contact) => (
              <InviteContact
                key={user.userID}
                userID={user.userID}
                username={user.username}
                invite={() => {
                  socket.emit('channelInvite', {
                    chanID,
                    userID: user.userID
                  });
                }}
              />
            ))}
          </>
        ) : null}
        <div className="mt-5 flex w-full items-center justify-center">
          <PrimaryButton onClick={toggleChannelView}>Continue</PrimaryButton>
        </div>
      </Scrollable>
      <div className="h-14 w-[336px]" />
    </>
  );
}
