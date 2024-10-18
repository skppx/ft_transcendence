import { useNavigate } from 'react-router-dom';
import { LegacyRef, MouseEventHandler } from 'react';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

interface ChanContactProps {
  children?: React.ReactNode;
  username: string;
  onContextMenu?: MouseEventHandler | undefined;
  innerRef?: LegacyRef<any> | undefined;
  hideUsername?: boolean;
  showPointer?: boolean;
  userID: string;
}

export function ChanContact({
  children: buttons,
  username,
  onContextMenu,
  innerRef,
  hideUsername,
  showPointer,
  userID
}: ChanContactProps) {
  const navigate = useNavigate();
  return (
    <>
      <div
        ref={innerRef}
        onContextMenu={onContextMenu}
        role="presentation"
        className={`mx-2 ${
          showPointer ? 'cursor-pointer' : ''
        } my-1 flex flex-shrink-0 items-center justify-between rounded p-3 text-left ${
          hideUsername ? 'bg-pong-blue-500' : ''
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <ProfilePicture
            size="xs"
            userID={userID}
            onClick={() => navigate(`/profile/${username}`)}
            username={username}
          />
          {hideUsername ? null : (
            <p className="semibold max-w-[200px] break-all text-base text-pong-white">
              {username}
            </p>
          )}
        </div>
        <div className="flex flex-row gap-3">{buttons}</div>
      </div>
      <hr className="border-pong-blue-700" />
    </>
  );
}
